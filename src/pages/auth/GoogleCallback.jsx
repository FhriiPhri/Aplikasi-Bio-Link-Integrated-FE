import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../utils/axiosClient";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkUser } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login?error=google_failed", { replace: true });
      return;
    }

    localStorage.setItem("token", token);
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    checkUser().then(() => {
      navigate("/dashboard", { replace: true });
    });

  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-indigo-600 mb-4"></span>
        <p className="text-gray-700 font-medium text-lg">
          Signing you in with Google...
        </p>
        <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}
