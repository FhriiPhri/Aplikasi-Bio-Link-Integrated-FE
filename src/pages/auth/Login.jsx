import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import loginImage from "../../assets/img4.jpg";
import icon2 from "../../assets/icon2.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    type: "",
    title: "",
    message: "",
    detail: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    // Google Redirect Error
    if (error === "banned") {
      setErrorMessage({
        type: "banned",
        title: "Akun Dinonaktifkan",
        message: "Akun Anda dinonaktifkan",
        detail: params.get("message") || "Silakan hubungi administrator",
      });
      setShowErrorModal(true);
      navigate("/login", { replace: true });
    }

    // Failed Google
    if (error === "google_failed") {
      setErrorMessage({
        type: "error",
        title: "Login Google Gagal",
        message: "Autentikasi Google gagal. Silakan coba lagi.",
      });
      setShowErrorModal(true);
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);

  // Handle All Redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    // Google Redirect Error
    if (error === "banned") {
      setErrorMessage({
        type: "banned",
        title: "Akun Dinonaktifkan",
        message: "Akun Anda dinonaktifkan",
        detail: params.get("message") || "Silakan hubungi administrator",
      });
      setShowErrorModal(true);
      navigate("/login", { replace: true });
    }

    // Failed Google
    if (error === "google_failed") {
      setErrorMessage({
        type: "error",
        title: "Login Google Gagal",
        message: "Autentikasi Google gagal. Silakan coba lagi.",
      });
      setShowErrorModal(true);
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);

  // Handle Redirect After Login
  useEffect(() => {
    if (!loading && user && location.pathname !== "/google/callback") {
      // Cek banned (backend return boolean)
      if (user.is_active === false) {
        navigate("/banned", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      }
    }
  }, [loading, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axiosClient.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("justLoggedIn", "true");
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      // Simpan email
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Set user (useEffect handle redirect)
      setUser(data.user);

      // Cek active status
      if (data.user.is_active === true) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage({
        type: "error",
        title: "Login Gagal",
        message: err.response?.data?.message || "Email atau password salah!",
      });
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google/redirect";
  };

  const goToLandingPage = () => {
    navigate("/");
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.7s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.7s ease-out;
        }

        .animate-slideRight {
          animation: slideRight 0.9s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-custom {
          animation: pulseCustom 2s ease-in-out infinite;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes pulseCustom {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .input-focus-effect {
          transition: all 0.3s ease;
        }

        .input-focus-effect:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
        }

        .btn-gradient-animated {
          background-size: 200% auto;
          transition: all 0.3s ease;
        }

        .btn-gradient-animated:hover {
          background-position: right center;
        }

        /* Custom checkbox styling */
        .custom-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .custom-checkbox:checked {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }

        .custom-checkbox:checked::after {
          content: "✓";
          position: absolute;
          color: white;
          font-size: 14px;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .custom-checkbox:hover {
          border-color: #4f46e5;
        }
      `}</style>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl animate-scaleIn">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Login Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Welcome back! Redirecting to dashboard...
              </p>

              {/* Loading Indicator */}
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="text-sm font-medium">Redirecting...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banned Account Modal */}
      {showErrorModal && errorMessage.type === "banned" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-scaleIn">
            <div className="flex flex-col text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-custom">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {errorMessage.title}
              </h3>
              <p className="text-gray-600 mb-4">{errorMessage.message}</p>

              {/* Ban Detail Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-red-100">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">
                      Alasan Penonaktifan:
                    </p>
                    <p className="text-red-700 text-sm leading-relaxed">
                      {errorMessage.detail ||
                        "Akun Anda telah dinonaktifkan oleh administrator."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Admin Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Butuh Bantuan?
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href="mailto:synapsebioapp@gmail.com"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      synapsebioapp@gmail.com
                    </a>
                  </div>

                  <p className="text-xs text-gray-500">
                    Hubungi administrator untuk mengajukan permohonan aktivasi
                    ulang akun
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/banned")}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  Hubungi Admin
                </button>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Error Modal */}
      {showErrorModal && errorMessage.type === "error" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl animate-scaleIn">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4 animate-shake">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {errorMessage.title}
              </h3>
              <p className="text-gray-600 mb-4">{errorMessage.message}</p>

              {/* Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="btn w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-white">
        {/* Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-30 blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-pink-200 rounded-full opacity-30 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* LEFT: LOGIN FORM */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative z-10 animate-fadeIn overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto">
            {/* Brand Logo */}
            <div className="mb-6 animate-slideDown">
              <div className="flex items-center gap-2">
                <img src={icon2} alt="Synapse Logo" className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Synapse
                </span>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 animate-slideUp">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                Hello,
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>
              <p className="text-gray-600">
                Hey, welcome back to your special place
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 animate-slideUp delay-100"
            >
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full pl-11 pr-4 py-2.5 h-12 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 relative z-0"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-11 pr-4 py-2.5 h-12 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 relative z-0"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-indigo-600 hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-white loading-sm"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-5 animate-slideUp delay-200">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500 font-medium">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn w-full h-12 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 animate-slideUp delay-200"
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
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-blue-600 transition-colors"
              >
                Sign Up
              </Link>
            </p>

            {/* Back to Home */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <button
                onClick={goToLandingPage}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors py-1 group"
              >
                <svg
                  className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
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
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: IMAGE SECTION */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-indigo-50 to-blue-50 items-center justify-center animate-slideRight">
          {/* Home Button */}
          <div className="absolute top-8 right-8 z-20 animate-slideDown">
            <button
              onClick={goToLandingPage}
              className="glass-card px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-gray-700 transform group-hover:-translate-x-1 transition-transform"
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
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                Home
              </span>
            </button>
          </div>

          {/* Image Container */}
          <div className="relative w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl animate-float">
            <img
              src={loginImage}
              alt="Login visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to--600/10"></div>
          </div>

          {/* Quote Card */}
          <div className="absolute bottom-12 left-12 right-12 glass-card p-6 rounded-2xl shadow-xl animate-slideUp delay-300">
            <p className="text-gray-800 text-lg font-semibold mb-2">
              "Your journey to productivity starts here"
            </p>
            <p className="text-gray-600 text-sm font-medium">— Synapse Team</p>
          </div>
        </div>
      </div>
    </>
  );
}