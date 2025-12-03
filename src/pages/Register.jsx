import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && user && location.pathname === "/register") {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register user
      await axiosClient.post("/register", {
        name,
        username,
        email,
        password,
      });

      // Sukses register, redirect ke login
      alert("Register berhasil! Silakan login.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Register gagal. " + (err.response?.data?.message || "Coba lagi!"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/api/auth/google/redirect";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full h-full max-w-2xl">
            {/* Main card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
                <p className="text-white/80">Create amazing links in minutes</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-24 left-16 w-28 h-28 bg-yellow-300 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl">🎯</span>
            </div>

            <div className="absolute bottom-28 right-20 w-24 h-24 bg-blue-400 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🌟</span>
            </div>

            <div className="absolute top-1/3 right-16 w-20 h-20 bg-green-300 rounded-xl shadow-xl flex items-center justify-center transform rotate-12 hover:rotate-6 transition-transform duration-300">
              <span className="text-2xl">🚀</span>
            </div>

            <div className="absolute bottom-1/4 left-24 w-16 h-16 bg-orange-400 rounded-lg shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-xl">💫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">YourBrand</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200"
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
              <span className="font-medium text-gray-700">Sign up with Google</span>
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-medium hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}