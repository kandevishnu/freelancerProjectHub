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

    // 1. Be Optimistic: Load local data first for a fast UI
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAxiosAuthToken(storedToken);
    }

    // 2. Verify in the background
    try {
      // If a token exists, try to verify it
      if (storedToken) {
        const res = await axios.get("/api/auth/me");
        // 3a. Success: Silently update with fresh data
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      // 3b. Failure: The optimistic state was wrong. Log the user out.
      console.error("Auth verification failed:", err?.response?.data || err.message);
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAxiosAuthToken(null);
    } finally {
      // We are done checking, so stop the loading state.
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

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
