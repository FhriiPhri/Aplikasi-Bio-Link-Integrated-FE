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

      
      setUser(data);
    } catch (err) {
      console.error("Failed to load user:", err);

    
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];

      setUser(null);
    } finally {
      setLoading(false);
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
        checkUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
