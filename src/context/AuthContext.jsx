import { createContext, useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosClient.get("/user");
      
      // Pastikan avatar_url ada
      if (data.avatar) {
        data.avatar_url = data.avatar_url || `${import.meta.env.VITE_API_BASE_URL}/storage/${data.avatar}`;
      }
      
      setUser(data);
    } catch (err) {
      console.error("Failed to load user:", err);

      // Clear invalid token
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const { data } = await axiosClient.get("/user");
      
      if (data.avatar) {
        data.avatar_url = data.avatar_url || `${import.meta.env.VITE_API_BASE_URL}/storage/${data.avatar}`;
      }
      
      setUser(data);
      console.log("User refreshed:", data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];

      setUser(null);
      setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        checkUser,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}