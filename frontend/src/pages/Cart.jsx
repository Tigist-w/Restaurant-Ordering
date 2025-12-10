import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function Cart() {
  const { cartItems, setCart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );

  // Load saved cart from backend when user logs in
  useEffect(() => {
    if (user) {
      API.get("/cart", { headers: { Authorization: `Bearer ${user.token}` } })
        .then((res) => setCart(res.data))
        .catch((err) => console.error("Load cart error:", err));
    }
  }, [user, setCart]);

  // Save cart to backend
  const saveCartBackend = async (currentCart = cartItems) => {
    if (!user) return;
    try {
      await API.post(
        "/cart",
        { cartItems: currentCart },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error("Save cart error:", err.response || err);
    }
  };

  // Stripe checkout
  const handleCheckoutStripe = async () => {
    if (!user) return toast.error("Please login first!");
    if (cartItems.length === 0) return toast.error("Cart is empty!");

    setLoading(true);
    try {
      // 1️⃣ Save cart backend before redirect
      await saveCartBackend();

      // 2️⃣ Create Stripe checkout session
      const { data } = await API.post(
        "/payment/create-checkout-session",
        { cartItems },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // 3️⃣ Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      console.error(
        "Stripe checkout error:",
        err.response?.data || err.message
      );
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cash on Delivery checkout
  const handleCheckoutCash = async () => {
    if (!user) return toast.error("Please login first!");
    if (cartItems.length === 0) return toast.error("Cart is empty!");

    setLoading(true);
    try {
      const orderItems = cartItems.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
      }));

      // 1️⃣ Create order
      const { data } = await API.post(
        "/orders",
        {
          items: orderItems,
          totalPrice: total,
          paymentMethod: "Cash",
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("Order placed! Pay cash on delivery.");
      console.log("Cash order created:", data);

      // 2️⃣ Clear backend cart separately
      try {
        await API.post(
          "/cart",
          { cartItems: [] },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } catch (clearErr) {
        console.error("Cart clearing failed:", clearErr.response || clearErr);
      }

      // 3️⃣ Clear frontend cart
      clearCart();
    } catch (err) {
      console.error(
        "Order creation failed:",
        err.response?.data || err.message
      );
      toast.error("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    saveCartBackend();
    toast.info("Item removed from cart");
  };

  const handleQtyChange = (id, qty) => {
    updateQuantity(id, qty);
    saveCartBackend();
    toast.info("Cart updated");
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.menuItem._id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-4"
            >
              <div className="flex items-center gap-4">
                {item.menuItem.image && (
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.menuItem.name}</h3>
                  <p className="text-green-600 font-bold">
                    ${item.menuItem.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQtyChange(item.menuItem._id, Number(e.target.value))
                  }
                  className="w-16 p-1 border rounded"
                />
                <button
                  onClick={() => handleRemoveItem(item.menuItem._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right font-bold text-xl mb-4">
            Total: ${total}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckoutStripe}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-full"
            >
              {loading ? "Processing..." : "Pay with Card"}
            </button>

            <button
              onClick={handleCheckoutCash}
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition w-full"
            >
              {loading ? "Processing..." : "Cash on Delivery"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
