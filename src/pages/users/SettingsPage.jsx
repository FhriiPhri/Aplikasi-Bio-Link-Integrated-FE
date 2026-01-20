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
  Info,
  AlertTriangle,
  Shield,
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
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-700 font-bold text-lg">Loading Settings...</p>
            <p className="mt-2 text-gray-500 text-sm">Please wait a moment</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-50 animate-slideIn max-w-sm mx-auto sm:mx-0">
            <div
              className={`flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
                toast.type === "success"
                  ? "bg-green-500 text-white border-green-400"
                  : "bg-red-500 text-white border-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle size={14} className="sm:size-[18px]" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <XCircle size={14} className="sm:size-[18px]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base">
                  {toast.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-xs sm:text-sm opacity-95 truncate">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={16} className="sm:size-[18px]" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all"
            >
              <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
                Settings
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Manage your account security & preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Stats */}
            <div className="lg:col-span-1 space-y-4">
              {/* Security Status Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-blue-500 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} className="text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Security Status</h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Your account security level
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasPassword ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <Lock size={18} className={hasPassword ? 'text-green-600' : 'text-yellow-600'} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Password</p>
                        <p className="text-xs text-gray-500">
                          {hasPassword ? 'Protected' : 'Not set'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${hasPassword ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Security Score</span>
                      <span className="text-xs font-bold text-blue-600">{hasPassword ? '85%' : '45%'}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${hasPassword ? 'bg-green-500' : 'bg-yellow-500'} transition-all duration-500`}
                        style={{ width: hasPassword ? '85%' : '45%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Strong Password</p>
                      <p className="text-xs text-gray-600">Use 8+ characters with mix of letters, numbers & symbols</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Unique Password</p>
                      <p className="text-xs text-gray-600">Don't reuse passwords from other accounts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Regular Updates</p>
                      <p className="text-xs text-gray-600">Change password every 3-6 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Password Management Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-6 py-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <KeyRound size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Password & Authentication
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {hasPassword
                          ? "Update your password to keep your account secure"
                          : "Set a password to enable email login"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <PasswordSettings
                    hasPassword={hasPassword}
                    showToast={showToast}
                  />
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                <div className="bg-red-500 px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <AlertTriangle size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Danger Zone</h2>
                      <p className="text-red-100 text-sm">
                        Irreversible actions that affect your account
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Delete Account */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <Trash2 size={20} className="text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base mb-1">
                            Delete Account
                          </h4>
                          <p className="text-sm text-gray-600">
                            Permanently remove your account and all data
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="group px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Trash2 size={18} />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>

                  {/* Warning Notice */}
                  <div className="bg-yellow-50 border-2 border-amber-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <AlertCircle size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 font-bold mb-2">
                          ⚠️ Important Warning
                        </p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          Account deletion is <span className="font-bold">permanent and irreversible</span>. 
                          All your data, posts, and connections will be lost forever.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                    <AlertTriangle size={28} className="sm:size-[32px] text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                      Delete Account?
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900 font-bold mb-3">
                        Warning: This will permanently delete:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-red-800">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          Your profile and personal information
                        </li>
                        <li className="flex items-center gap-2 text-sm text-red-800">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          All your posts and content
                        </li>
                        <li className="flex items-center gap-2 text-sm text-red-800">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          Your connections and followers
                        </li>
                        <li className="flex items-center gap-2 text-sm text-red-800">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          Account history and activity
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <AlertTriangle size={18} className="text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      Are you absolutely sure you want to proceed?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 border-2 border-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500 pt-2">
                    By clicking "Delete Account", you agree to permanently remove all your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0) translateY(0);
            }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-slideIn {
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
    if (strength === 0) return "Very weak";
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
      showToast("error", "New password must be at least 8 characters!");
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
    <div className="space-y-6">
      {!hasPassword ? (
        <div className="space-y-5">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <AlertCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-900 font-bold mb-1">
                  Set a password to enable email login
                </p>
                <p className="text-sm text-blue-700">
                  This allows you to log in using email & password in addition to Google Sign-In
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound size={16} className="text-blue-600" />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 pr-12 font-medium"
                  value={setPasswordForm.password}
                  onChange={(e) => {
                    setSetPasswordForm({
                      ...setPasswordForm,
                      password: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  placeholder="Enter a strong password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {setPasswordForm.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-600">Password Strength</span>
                    <span className="text-xs font-bold text-blue-600">{getStrengthText(passwordStrength)}</span>
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
                  <div className="mt-3 text-xs text-gray-600 space-y-1.5">
                    <p className={setPasswordForm.password.length >= 8 ? "text-green-600 font-semibold" : ""}>
                      • At least 8 characters
                    </p>
                    <p className={/[A-Z]/.test(setPasswordForm.password) ? "text-green-600 font-semibold" : ""}>
                      • Contains uppercase letter
                    </p>
                    <p className={/[0-9]/.test(setPasswordForm.password) ? "text-green-600 font-semibold" : ""}>
                      • Contains number
                    </p>
                    <p className={/[^A-Za-z0-9]/.test(setPasswordForm.password) ? "text-green-600 font-semibold" : ""}>
                      • Contains special character
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound size={16} className="text-blue-600" />
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 pr-12 font-medium"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {setPasswordForm.password_confirmation && (
                <div className="mt-2">
                  {setPasswordForm.password === setPasswordForm.password_confirmation ? (
                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                      <Check size={14} />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-semibold flex items-center gap-1.5">
                      <X size={14} />
                      Passwords don't match
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSetPassword}
                disabled={
                  loading ||
                  !setPasswordForm.password ||
                  !setPasswordForm.password_confirmation ||
                  setPasswordForm.password !== setPasswordForm.password_confirmation ||
                  setPasswordForm.password.length < 8
                }
                className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Setting Password...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Set Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <ShieldCheck size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-900 font-bold mb-1">
                  Your account is password protected
                </p>
                <p className="text-sm text-green-700">
                  You can change your password below to keep your account secure
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Current Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 pr-12 font-medium"
                  value={changePasswordForm.current_password}
                  onChange={(e) =>
                    setChangePasswordForm({
                      ...changePasswordForm,
                      current_password: e.target.value,
                    })
                  }
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPasswords.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound size={16} className="text-blue-600" />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 pr-12 font-medium"
                  value={changePasswordForm.password}
                  onChange={(e) => {
                    setChangePasswordForm({
                      ...changePasswordForm,
                      password: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  placeholder="Enter new password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {changePasswordForm.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-600">Password Strength</span>
                    <span className="text-xs font-bold text-blue-600">{getStrengthText(passwordStrength)}</span>
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
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound size={16} className="text-blue-600" />
                  Confirm New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 pr-12 font-medium"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPasswords.confirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {changePasswordForm.password_confirmation && (
                <div className="mt-2">
                  {changePasswordForm.password === changePasswordForm.password_confirmation ? (
                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                      <Check size={14} />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-semibold flex items-center gap-1.5">
                      <X size={14} />
                      Passwords don't match
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
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
                className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[99] p-3 sm:p-4 animate-scaleIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600">
                    Confirm your password change
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border-2 border-amber-200 rounded-2xl p-4">
                  <p className="text-sm text-amber-900 font-semibold">
                    You will be logged out from all other devices after changing your password.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmChangePassword}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Confirm Change</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}