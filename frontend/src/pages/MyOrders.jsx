import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusSteps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "On the way",
  "Delivered",
];

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    API.get("/orders/myorders", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
      });
  }, [user]);

  const renderStatus = (status) => {
    const currentIndex = statusSteps.indexOf(status);
    return (
      <div className="flex items-center gap-2 mt-2">
        {statusSteps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                index <= currentIndex
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300"
              }`}
            />
            <span className="text-xs mt-1">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">
          You have no previous orders.
        </p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="p-4 bg-white rounded shadow mb-6">
            <div className="flex justify-between items-center mb-2">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total:</strong> ${order.totalPrice}
              </p>
            </div>

            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside mt-1">
                {order.items.map((item, idx) => {
                  const menu = item?.menuItem;
                  return (
                    <li key={idx}>
                      {menu?.name ? menu.name : "Item Removed"} x{" "}
                      {item.quantity}
                    </li>
                  );
                })}
              </ul>
            </div>

            {renderStatus(order.status)}
          </div>
        ))
      )}
    </div>
  );
}
