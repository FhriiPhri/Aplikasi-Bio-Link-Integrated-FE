import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/users/DashboardUsers";
import GoogleCallback from "./pages/auth/GoogleCallback";
import AdminDashboard from "./pages/admins/DashboardAdmin";
import AdminBundlesPage from "./pages/admins/AdminBundlesPage";
import BundlePreviewPage from "./pages/admins/PreviewBundlePage";


import ProtectedRoute from "./components/routes/ProtectedRoute";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import BannedRoute from "./components/routes/BannedRoute";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/Profile";
import SupportPage from "./pages/users/SupportPage";
import SettingsPage from "./pages/users/SettingsPage";
import PremiumPackPage from "./pages/users/PremiumPackPage";
import BannedPage from "./pages/BannedPage";
import AdminAppealsPage from "./pages/admins/Banding";
import ThemeTest from "./pages/ThemeTest";
import BundlePage from "./pages/users/BundlePage";
import BundleEditorPage from './pages/users/BundleEditorPage';

// Route
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/google/callback" element={<GoogleCallback />} />

          {/* Banned Page */}
          <Route
            path="/banned"
            element={
              <BannedRoute>
                <BannedPage />
              </BannedRoute>
            }
          />

          {/* User-only (user aktif) */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <Dashboard />
              </UserRoute>
            }
          />
          <Route
            path="/support"
            element={
              <UserRoute>
                <SupportPage />
              </UserRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <UserRoute>
                <SettingsPage />
              </UserRoute>
            }
          />
          <Route
            path="/premium-pack"
            element={
              <UserRoute>
                <PremiumPackPage />
              </UserRoute>
            }
          />
          <Route
            path="/bundles-page"
            element={
              <UserRoute>
                <BundlePage />
              </UserRoute>
            }
          />
          <Route
            path="/bundles/:bundleId/edit"
            element={
              <UserRoute>
                <BundleEditorPage />
              </UserRoute>
            }
          />

          <Route
            path="/theme-test"
            element={
              <ProtectedRoute>
                <ThemeTest />
              </ProtectedRoute>
            }
          />

          {/* Shared (user & admin) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bundles"
            element={
              <AdminRoute>
                <AdminBundlesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bundles/:id"
            element={
              <AdminRoute>
                <BundlePreviewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/banding"
            element={
              <AdminRoute>
                <AdminAppealsPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}