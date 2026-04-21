import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  /* ================================
     LOAD USER ON REFRESH
  ================================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      API.defaults.headers.common["Authorization"] =
        `Bearer ${storedToken}`;
    }
  }, []);

  /* ================================
     LOGIN
  ================================= */
  const login = (userData, token, refreshToken) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    API.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  };

  /* ================================
     LOGOUT
  ================================= */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.clear();

    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};