import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import loginImage from "../assets/img4.jpg";
import icon2 from "../assets/icon2.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && location.pathname !== "/google/callback") {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axiosClient.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Login gagal. Cek email dan password kamu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google/redirect";
  };

  // Function to go back to landing page
  const goToLandingPage = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-indigo-600"></span>
      </div>
    );
  }

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row">
      {/* LEFT: LOGIN FORM — FULL WHITE & LIGHT */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-6 md:p-10 lg:p-16">
        {/* Header with back button */}
        <div className="mb-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img src={icon2} alt="Synapse Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Synapse</span>
          </div>
        </div>

        {/* Welcome */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Holla,
          <br />
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-8">
          Hey, welcome back to your special place
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 rounded-lg pl-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 rounded-lg pl-3"
            required
          />

          {/* Remember me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 w-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center justify-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Alternative back button at the bottom */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={goToLandingPage}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm">Return to Landing Page</span>
          </button>
        </div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={loginImage}
          alt="Login background"
          className="w-full h-full object-cover"
        />
        {/* Overlay with back button for image side */}
        <div className="absolute top-6 left-6">
          <button
            onClick={goToLandingPage}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}