import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GoogleCallback from "./pages/GoogleCallback";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile"; 
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Register */}
          <Route path="/register" element={<Register />} />

          {/* Google OAuth */}
          <Route path="/google/callback" element={<GoogleCallback />} />

          {/* Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile (protected) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
