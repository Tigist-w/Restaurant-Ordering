// client/src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import MenuManagement from "../components/MenuManagement.jsx";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });

  const statusSteps = [
    "Pending",
    "Confirmed",
    "Preparing",
    "On the way",
    "Delivered",
    "Cancelled",
  ];

  // Fetch orders & menu
  const fetchData = async () => {
    try {
      const { data: ordersData } = await API.get("/orders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(ordersData);

      const { data: menuData } = await API.get("/menu", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMenu(menuData);

      setStats({
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        ),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(
        `/orders/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await API.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Order deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl mb-2">Total Orders</h2>
          <p className="text-green-600 text-2xl font-bold">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl mb-2">Total Revenue</h2>
          <p className="text-green-600 text-2xl font-bold">
            ${stats.totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl mb-2">Total Menu Items</h2>
          <p className="text-green-600 text-2xl font-bold">{menu.length}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">{order._id.slice(-6)}</td>
                  <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">${order.totalPrice}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      {statusSteps.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MenuManagement token={user.token} />
    </div>
  );
}
