import { createContext, useState } from "react";
import { API } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", {
      email,
      password,
    });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password,
    });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
