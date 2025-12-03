import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import registerImage from "../assets/img5.png";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("dark"); // default: dark mode

  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Baca preferensi dari localStorage saat pertama kali render
  useEffect(() => {
    const savedMode = localStorage.getItem("theme") || "dark";
    setMode(savedMode);
  }, []);

  // Simpan preferensi ke localStorage saat mode berubah
  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${mode === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className={`text-xl font-semibold ${mode === "dark" ? "text-white" : "text-gray-700"} animate-pulse`}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual (Diperbarui dengan Gambar Ilustrasi) */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
          {/* Gambar Ilustrasi */}
          <img
            src={registerImage} // Ganti URL ini jika Anda menyimpan gambar di lokasi lain
            alt="Illustration of a person using a smartphone surrounded by digital interfaces"
            className="w-full h-full object-cover"
          />
      </div>

      {/* Right Side - Form (Dinamis berdasarkan mode) */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${mode === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className={`text-3xl font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>Synapse</h1>
            {/* Toggle Mode */}
            <button
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full ${mode === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-800"} transition`}
              aria-label={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}
            >
              {mode === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A7 7 0 0018 10c-2.761 0-5.375 1.246-7.098 3.317-1.722 2.07-2.69 4.837-2.69 7.828h12.014zM10 10a7 7 0 007 7h1.014a7 7 0 00-7-7H10z" />
                </svg>
              )}
            </button>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${mode === "dark" ? "text-white" : "text-gray-900"} mb-2`}>Create account</h2>
            <p className={`${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-200"
                } border focus:ring-2 outline-none transition`}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-200"
                } border focus:ring-2 outline-none transition`}
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-200"
                } border focus:ring-2 outline-none transition`}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-200"
                } border focus:ring-2 outline-none transition`}
                required
              />
            </div>

            {/* Tombol Sign Up (tetap gradient ungu, tapi sesuaikan teks jika perlu) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className={`flex-1 border-t ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}></div>
            <span className={`px-4 text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>OR</span>
            <div className={`flex-1 border-t ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}></div>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignup}
              type="button"
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg ${
                mode === "dark"
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              } border transition duration-200`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">Sign up with Google</span>
            </button>
          </div>

          {/* Terms */}
          <p className={`mt-6 text-xs text-center ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            By signing up, you agree to our{" "}
            <a href="#" className={`text-purple-400 hover:underline ${mode === "dark" ? "text-purple-400" : "text-purple-600"}`}>
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className={`text-purple-400 hover:underline ${mode === "dark" ? "text-purple-400" : "text-purple-600"}`}>
              Privacy Policy
            </a>
          </p>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <Link to="/login" className={`text-purple-400 font-medium hover:underline ${mode === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}