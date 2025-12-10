import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import MyOrders from "../pages/MyOrders"; // <-- YOU FORGOT THIS

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<Menu />} />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      {/* ADMIN ORDERS PAGE */}
      <Route
        path="/orders"
        element={
          <PrivateRoute role="admin">
            <Orders />
          </PrivateRoute>
        }
      />

      {/* CUSTOMER MY ORDERS PAGE */}
      <Route
        path="/my-orders"
        element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute role="admin">
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
