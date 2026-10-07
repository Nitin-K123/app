import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("psi_auth");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const persist = useCallback((data) => {
    if (data) localStorage.setItem("psi_auth", JSON.stringify(data));
    else localStorage.removeItem("psi_auth");
    setAuth(data);
  }, []);

  useEffect(() => {
    // refresh user on mount if token exists
    if (auth?.token) {
      api.me().then(({ user }) => persist({ ...auth, user })).catch(() => persist(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      persist(data);
      return data;
    } finally { setLoading(false); }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await api.register(payload);
      persist(data);
      return data;
    } finally { setLoading(false); }
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user: auth?.user, token: auth?.token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
