import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import registerImage from "../../assets/img5.png";
import icon2 from "../../assets/icon2.png";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      await axiosClient.post("/register", {
        name,
        username,
        email,
        password,
      });
      setShowSuccessModal(true);
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

  const goToLandingPage = () => {
    navigate("/");
  };

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

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-slideLeft { animation: slideLeft 0.8s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        
        /* Mobile Responsive Fixes */
        @media (max-width: 768px) {
          .mobile-stack {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
          .mobile-full-width {
            width: 100% !important;
            max-width: 100% !important;
          }
          .mobile-padding {
            padding: 1.5rem 1rem !important;
          }
          .mobile-center {
            text-align: center !important;
          }
          .mobile-mt-2 {
            margin-top: 0.5rem !important;
          }
          .mobile-mb-3 {
            margin-bottom: 0.75rem !important;
          }
          .mobile-text-sm {
            font-size: 0.875rem !important;
          }
          .mobile-text-base {
            font-size: 1rem !important;
          }
          .mobile-text-lg {
            font-size: 1.125rem !important;
          }
          .mobile-text-xl {
            font-size: 1.25rem !important;
          }
          .mobile-text-2xl {
            font-size: 1.5rem !important;
          }
          .mobile-text-3xl {
            font-size: 1.875rem !important;
          }
          .mobile-h-10 {
            height: 2.5rem !important;
          }
          .mobile-h-11 {
            height: 2.75rem !important;
          }
          .mobile-py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .mobile-py-2\.5 {
            padding-top: 0.625rem !important;
            padding-bottom: 0.625rem !important;
          }
        }
      `}</style>

      {/* Success Modal - Responsive */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm mx-auto shadow-2xl animate-scaleIn">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    style={{
                      strokeDasharray: 100,
                      animation: "checkmark 0.6s ease-out forwards",
                    }}
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 mobile-text-lg">
                Registration Successful!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 mobile-text-sm">
                Your account has been created successfully. You can now login to
                your account.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="btn w-full h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg border-0 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row-reverse bg-white mobile-stack">
        {/* Mobile Back Button - Only on mobile */}
        <div className="lg:hidden w-full px-4 py-3 border-b border-gray-100 bg-white">
          <button
            onClick={goToLandingPage}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* LEFT: FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 lg:py-0 relative z-10 animate-fadeIn overflow-y-auto mobile-full-width mobile-padding">
          <div className="max-w-md w-full">
            {/* Brand Logo */}
            <div className="mb-6 animate-slideDown mobile-center">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <img
                  src={icon2}
                  alt="Synapse Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                />
                <span className="text-lg sm:text-xl font-bold text-black mobile-text-lg">
                  Synapse
                </span>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 animate-slideUp mobile-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 mobile-text-2xl">
                Create Account
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mobile-text-sm">
                Sign up to get started
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 animate-slideUp delay-100"
            >
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 mobile-text-sm">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 h-11 sm:h-12 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 mobile-text-sm">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 h-11 sm:h-12 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 mobile-text-sm">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
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
                    className="input w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 h-11 sm:h-12 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 mobile-text-sm">
                  Password
                </label>

                <div className="relative">
                  {/* Icon kiri */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <Lock size={18} className="sm:w-5 sm:h-5" />
                  </div>

                  {/* Input */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                    required
                  />

                  {/* Toggle mata */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Eye size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn w-full h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] text-sm sm:text-base"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4 sm:my-5 animate-slideUp delay-200">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500 font-medium mobile-text-xs">
                or
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="btn w-full h-11 sm:h-12 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 animate-slideUp delay-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
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
              Sign up with Google
            </button>

            {/* Terms */}
            <p className="mt-4 text-xs text-center text-gray-500 mobile-text-xs px-2">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-blue-600 font-medium"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-blue-600 font-medium"
              >
                Privacy Policy
              </a>
            </p>

            {/* Login Link */}
            <p className="text-center mt-4 text-sm text-gray-600 mobile-text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
            </p>

            {/* Back to Home - Desktop only */}
            <div className="mt-5 pt-5 border-t border-gray-200 hidden lg:block">
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

        {/* RIGHT: IMAGE - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-50 to-blue-50 items-center justify-center animate-slideLeft">
          {/* Home Button */}
          <div className="absolute top-8 left-8 z-20 animate-slideDown">
            <button
              onClick={goToLandingPage}
              className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-2 border border-white/20"
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
          <div className="relative w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={registerImage}
              alt="Register visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10"></div>
          </div>

          {/* Quote Card */}
          <div className="absolute bottom-12 left-12 right-12 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 animate-slideUp delay-200">
            <p className="text-gray-800 text-lg font-semibold mb-2">
              "Join thousands of users already boosting their productivity"
            </p>
            <p className="text-gray-600 text-sm font-medium">— Synapse Team</p>
          </div>
        </div>
      </div>
    </>
  );
}