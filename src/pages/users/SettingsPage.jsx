import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import {
  ArrowLeft,
  X,
  Check,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import Layout from "../../components/layouts/Layout";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadSettingsInfo();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettingsInfo = async () => {
    try {
      const res = await axiosClient.get("/user/profile");
      const user = res.data.user;
      setHasPassword(user.has_password || false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load settings information");
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosClient.delete("/user/profile/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed");

      setShowDeleteModal(false);
      alert("Account deleted successfully");

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setShowDeleteModal(false);
      alert("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === "success"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className="ml-2 hover:opacity-80"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account security
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Security Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Security</h3>
                    <p className="text-sm text-gray-500">Account status</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className={hasPassword ? 'text-green-600' : 'text-gray-400'} />
                      <span className="text-sm font-medium text-gray-700">Password</span>
                    </div>
                    <span className={`text-sm font-semibold ${hasPassword ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasPassword ? 'Set' : 'Not set'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Security level</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {hasPassword ? 'Strong' : 'Basic'}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${hasPassword ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-500`}
                        style={{ width: hasPassword ? '85%' : '40%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block bg-white rounded-xl border border-red-200 overflow-hidden">
                <div className="border-b border-red-200 p-6 bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <AlertTriangle size={22} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                      <p className="text-sm text-gray-600 mt-0.5">Irreversible actions</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Trash2 size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600 mt-1">Permanently remove your account and all data</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Password Section */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <KeyRound size={22} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {hasPassword ? "Update your password" : "Set a password for your account"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <PasswordSettings
                    hasPassword={hasPassword}
                    showToast={showToast}
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone - Shown on mobile only, at the bottom */}
            <div className="lg:hidden lg:col-span-1 bg-white rounded-xl border border-red-200 overflow-hidden">
              <div className="border-b border-red-200 p-6 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <AlertTriangle size={22} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                    <p className="text-sm text-gray-600 mt-0.5">Irreversible actions</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Trash2 size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Delete Account</h4>
                      <p className="text-sm text-gray-600 mt-1">Permanently remove your account and all data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Account?</h3>
                    <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-900 font-semibold mb-3">
                    This will permanently delete:
                  </p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      Your profile and personal information
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      All your posts and content
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      Your connections and followers
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </Layout>
  );
}

// Password Settings Component
function PasswordSettings({ hasPassword, showToast }) {
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [setPasswordForm, setSetPasswordForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Too weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = () => {
    if (!changePasswordForm.current_password) {
      showToast("error", "Please enter your current password");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmChangePassword = async () => {
    if (changePasswordForm.password !== changePasswordForm.password_confirmation) {
      showToast("error", "New passwords do not match!");
      setShowConfirmModal(false);
      return;
    }

    if (changePasswordForm.password.length < 8) {
      showToast("error", "Password must be at least 8 characters!");
      setShowConfirmModal(false);
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/user/password/change", {
        current_password: changePasswordForm.current_password,
        password: changePasswordForm.password,
        password_confirmation: changePasswordForm.password_confirmation,
      });

      showToast("success", "Password changed successfully!");
      setChangePasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setShowConfirmModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to change password";
      showToast("error", errorMsg);
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (setPasswordForm.password !== setPasswordForm.password_confirmation) {
      showToast("error", "Passwords do not match!");
      return;
    }

    if (setPasswordForm.password.length < 8) {
      showToast("error", "Password must be at least 8 characters!");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/user/password/set", {
        password: setPasswordForm.password,
        password_confirmation: setPasswordForm.password_confirmation,
      });

      showToast("success", "Password has been set successfully!");
      setSetPasswordForm({ password: "", password_confirmation: "" });

      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to set password";
      showToast("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {!hasPassword ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Enable password login
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Set a password to log in with email & password
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={setPasswordForm.password}
                  onChange={(e) => {
                    setSetPasswordForm({
                      ...setPasswordForm,
                      password: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  placeholder="Enter password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {setPasswordForm.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Password strength</span>
                    <span className="text-xs font-semibold text-gray-700">{getStrengthText(passwordStrength)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          level <= passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={setPasswordForm.password_confirmation}
                  onChange={(e) =>
                    setSetPasswordForm({
                      ...setPasswordForm,
                      password_confirmation: e.target.value,
                    })
                  }
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {setPasswordForm.password_confirmation && (
                <p className={`text-sm mt-2 flex items-center gap-1.5 ${
                  setPasswordForm.password === setPasswordForm.password_confirmation
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {setPasswordForm.password === setPasswordForm.password_confirmation ? (
                    <><Check size={16} /> Passwords match</>
                  ) : (
                    <><X size={16} /> Passwords don't match</>
                  )}
                </p>
              )}
            </div>

            <button
              onClick={handleSetPassword}
              disabled={
                loading ||
                !setPasswordForm.password ||
                !setPasswordForm.password_confirmation ||
                setPasswordForm.password !== setPasswordForm.password_confirmation ||
                setPasswordForm.password.length < 8
              }
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ShieldCheck size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Password is set
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You can change your password below
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={changePasswordForm.current_password}
                  onChange={(e) =>
                    setChangePasswordForm({
                      ...changePasswordForm,
                      current_password: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={changePasswordForm.password}
                  onChange={(e) => {
                    setChangePasswordForm({
                      ...changePasswordForm,
                      password: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {changePasswordForm.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Password strength</span>
                    <span className="text-xs font-semibold text-gray-700">{getStrengthText(passwordStrength)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          level <= passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={changePasswordForm.password_confirmation}
                  onChange={(e) =>
                    setChangePasswordForm({
                      ...changePasswordForm,
                      password_confirmation: e.target.value,
                    })
                  }
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords.confirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {changePasswordForm.password_confirmation && (
                <p className={`text-sm mt-2 flex items-center gap-1.5 ${
                  changePasswordForm.password === changePasswordForm.password_confirmation
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {changePasswordForm.password === changePasswordForm.password_confirmation ? (
                    <><Check size={16} /> Passwords match</>
                  ) : (
                    <><X size={16} /> Passwords don't match</>
                  )}
                </p>
              )}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={
                loading ||
                !changePasswordForm.current_password ||
                !changePasswordForm.password ||
                !changePasswordForm.password_confirmation ||
                changePasswordForm.password !== changePasswordForm.password_confirmation ||
                changePasswordForm.password.length < 8
              }
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Confirm your password change
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-900">
                  You will be logged out from all devices after changing your password.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChangePassword}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-600"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}