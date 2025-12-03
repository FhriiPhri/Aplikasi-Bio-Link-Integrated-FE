import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.log("No token found");
      navigate("/login");
      return;
    }

    console.log("Token found:", token);
    
    localStorage.setItem("token", token);

    // Set axios header
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user
    axiosClient
      .get("/user")
      .then(({ data }) => {
        console.log("User data:", data);
        setUser(data.user);
      
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, [navigate, setUser]); 

  return <div>Loading Google login…</div>;
}