import { useEffect, useState, useContext } from "react";
import { API } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, [user.token]);

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">You have no orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-between mb-2">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order._id.slice(-6)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {order.status}
                </p>
              </div>
              <div>
                {order.items.map((i) => (
                  <div
                    key={i.menuItem._id}
                    className="flex justify-between mb-1"
                  >
                    <p>
                      {i.menuItem.name} x {i.quantity}
                    </p>
                    <p>${i.menuItem.price * i.quantity}</p>
                  </div>
                ))}
              </div>
              <p className="text-right font-bold mt-2">
                Total: ${order.totalPrice}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
