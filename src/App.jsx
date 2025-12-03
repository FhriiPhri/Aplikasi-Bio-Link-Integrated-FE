import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GoogleCallback from "./pages/GoogleCallback";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Login routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

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

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
