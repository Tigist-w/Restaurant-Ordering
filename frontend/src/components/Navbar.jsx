import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-green-600">
          MyRestaurant
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-500 transition">
            Home
          </Link>
          <Link to="/menu" className="hover:text-green-500 transition">
            Menu
          </Link>

          {user && user.role === "admin" && (
            <Link to="/dashboard" className="hover:text-green-500 transition">
              Dashboard
            </Link>
          )}

          {user && user.role !== "admin" && (
            <>
              <Link to="/cart" className="hover:text-green-500 transition">
                Cart
              </Link>
              <Link to="/my-orders" className="hover:text-green-500 transition">
                My Orders
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-500 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-green-500 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(!open)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block hover:text-green-500 transition">
            Home
          </Link>
          <Link to="/menu" className="block hover:text-green-500 transition">
            Menu
          </Link>
          {user && user.role === "admin" && (
            <Link
              to="/dashboard"
              className="block hover:text-green-500 transition"
            >
              Dashboard
            </Link>
          )}
          {user && user.role !== "admin" && (
            <>
              <Link
                to="/cart"
                className="block hover:text-green-500 transition"
              >
                Cart
              </Link>
              <Link
                to="/my-orders"
                className="block hover:text-green-500 transition"
              >
                My Orders
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-green-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-green-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
