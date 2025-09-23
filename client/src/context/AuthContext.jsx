import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const setAxiosAuthToken = (tok) => {
    if (tok) axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    else delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
  const init = async () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAxiosAuthToken(storedToken);
    }

    try {
      if (storedToken) {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Auth verification failed:", err?.response?.data || err.message);
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAxiosAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);

  const login = ({ token: tok, user: usr }) => {
    if (!tok || !usr) return;
    setUser(usr);
    setToken(tok);
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setAxiosAuthToken(tok);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAxiosAuthToken(null);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
