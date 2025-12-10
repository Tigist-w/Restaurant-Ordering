import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { API } from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Load persisted cart on login
  useEffect(() => {
    if (user) {
      API.get("/cart", { headers: { Authorization: `Bearer ${user.token}` } })
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error("Failed to load cart:", err));
    } else {
      setCartItems([]); // Clear cart if no user
    }
  }, [user]);

  // Save cart to backend
  const saveCartBackend = async (updatedCart) => {
    if (!user) return;
    try {
      await API.post(
        "/cart",
        { cartItems: updatedCart },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  };

  const addToCart = (item) => {
    const updatedCart = (() => {
      const exist = cartItems.find((i) => i.menuItem._id === item._id);
      if (exist) {
        return cartItems.map((i) =>
          i.menuItem._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...cartItems, { menuItem: item, quantity: 1 }];
      }
    })();

    setCartItems(updatedCart);
    saveCartBackend(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((i) => i.menuItem._id !== id);
    setCartItems(updatedCart);
    saveCartBackend(updatedCart);
  };

  const updateQuantity = (id, qty) => {
    const updatedCart = cartItems.map((i) =>
      i.menuItem._id === id ? { ...i, quantity: qty } : i
    );
    setCartItems(updatedCart);
    saveCartBackend(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartBackend([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCart: setCartItems, // allow Cart.jsx to set cart directly
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
