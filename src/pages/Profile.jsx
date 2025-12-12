///----backup code----///
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import {
  Camera,
  User,
  Phone,
  MessageCircle,
  ArrowLeft,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/layouts/Layout";

export default function Profile() {
  const { refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone_number: "",
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProfile = async () => {
    try {
      const res = await axiosClient.get("/user/profile");
      const user = res.data.user;

      setForm({
        name: user.name || "",
        username: user.username || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
      });

      setAvatarPreview(user.avatar_url || "https://i.pravatar.cc/150");
      setHasPassword(user.has_password || false);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/user/profile", form);

      if (refreshUser) {
        await refreshUser();
      }

      showToast("success", "Profile updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update profile");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10485760) {
      showToast("error", "File too large! Maximum size is 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file!");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setShowAvatarModal(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleAvatarUpload = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    setUploading(true);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const fd = new FormData();
      fd.append("avatar", croppedBlob, selectedFile.name);

      const res = await axiosClient.post("/user/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarPreview(res.data.avatar_url);
      setShowAvatarModal(false);
      setSelectedFile(null);
      setImageSrc(null);

      if (refreshUser) {
        await refreshUser();
      }

      showToast("success", "Avatar updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setShowAvatarModal(false);
    setSelectedFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(e);
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-slideIn">
            <div
              className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${
                toast.type === "success"
                  ? "bg-white border-green-200"
                  : "bg-white border-red-200"
              }`}
            >
              {toast.type === "success" ? (
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              ) : (
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="text-red-600" size={20} />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {toast.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-sm text-gray-600">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          <button
            onClick={goToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

           <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center">
                <div className="relative inline-block">
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-md mx-auto"
                  />
                  <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                    <Camera size={18} className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                  {form.name || "Your Name"}
                </h2>
                <p className="text-indigo-600 text-center mb-6">
                  @{form.username || "username"}
                </p>

              <div className="space-y-4">
                {/* Phone Number */}
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-indigo-600" />
                  </div>
                  <span>{form.phone_number || "No phone number"}</span>
                </div>
                    

                {/* Bio */}
                <div
                  className={`text-gray-600 text-sm ${
                    isBioExpanded 
                      ? 'flex flex-col gap-2' 
                      : 'flex flex-row gap-3'
                  }`}
                >
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={16} className="text-purple-600" />
                  </div>
                
                  <div className={isBioExpanded ? "w-full" : "max-w-[240px] flex-1"}>
                    {/* Container scrollable */}
                    <div
                      className={`leading-relaxed overflow-hidden ${
                        !isBioExpanded 
                          ? 'line-clamp-3' 
                          : 'max-h-32 overflow-y-auto pr-1' 
                      }`}
                      style={{ 
                        whiteSpace: isBioExpanded ? 'normal' : 'pre-line' 
                      }}
                    >
                      {form.bio || "No bio yet"}
                    </div>
                    
                    {/* button View all / Show less */}
                    {form.bio && form.bio.length > 120 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsBioExpanded(!isBioExpanded);
                        }}
                        className="mt-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        {isBioExpanded ? 'Show less' : 'View all'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Right Column - Edit Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Profile
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                      value={form.phone_number}
                      onChange={(e) =>
                        setForm({ ...form, phone_number: e.target.value })
                      }
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
                      <MessageCircle size={16} className="text-gray-400" />
                      Bio
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-h-[100px] text-gray-900 placeholder-gray-400 resize-none"
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-2.5 px-6 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
                 {/* Password Settings */}
              <div className="border-t border-gray-200">
                <PasswordSettings hasPassword={hasPassword} showToast={showToast}/>
              </div>
          </div>
        </div>

        {/* Image Crop Modal */}
        {showAvatarModal && imageSrc && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Crop Your Photo
                </h3>
                <button
                  onClick={handleCancelUpload}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={uploading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden mb-6">
                  <SimpleCropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <ZoomOut size={20} className="text-gray-400" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <ZoomIn size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Drag to reposition • Slide to zoom
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelUpload}
                    className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    disabled={uploading}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleAvatarUpload}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Upload
                      </>
                    )}
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
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

// Password Settings Component (Compact Version)
function PasswordSettings({ hasPassword, showToast }) {
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 🔹 State untuk modal

  const [setPasswordForm, setSetPasswordForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 🔹 Hanya tampilkan modal
  const handleChangePassword = () => {
    setShowConfirmModal(true);
  };

  // 🔹 Fungsi sebenarnya untuk mengganti password
  const confirmChangePassword = async () => {
    if (
      changePasswordForm.password !== changePasswordForm.password_confirmation
    ) {
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
      const errorMsg =
        err.response?.data?.message || "Failed to change password";
      showToast("error", errorMsg);
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
    <div className="p-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lock size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {hasPassword ? "Change Password" : "Set Password"}
          </h3>
          <p className="text-xs text-gray-500">
            {hasPassword ? "Update your password" : "Create a password"}
          </p>
        </div>
      </div>

      {!hasPassword ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex gap-2">
              <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Set a password to enable email login
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1.5 text-xs">
              <KeyRound size={14} className="text-gray-400" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                value={setPasswordForm.password}
                onChange={(e) =>
                  setSetPasswordForm({ ...setPasswordForm, password: e.target.value })
                }
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1.5 text-xs">
              <KeyRound size={14} className="text-gray-400" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                value={setPasswordForm.password_confirmation}
                onChange={(e) =>
                  setSetPasswordForm({ ...setPasswordForm, password_confirmation: e.target.value })
                }
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSetPassword}
            disabled={loading}
            className="w-full py-2 px-4 text-sm bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Setting...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Set Password</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1.5 text-xs">
              <Lock size={14} className="text-gray-400" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                value={changePasswordForm.current_password}
                onChange={(e) =>
                  setChangePasswordForm({ ...changePasswordForm, current_password: e.target.value })
                }
                placeholder="Current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1.5 text-xs">
              <KeyRound size={14} className="text-gray-400" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                value={changePasswordForm.password}
                onChange={(e) =>
                  setChangePasswordForm({ ...changePasswordForm, password: e.target.value })
                }
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1.5 text-xs">
              <KeyRound size={14} className="text-gray-400" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                value={changePasswordForm.password_confirmation}
                onChange={(e) =>
                  setChangePasswordForm({ ...changePasswordForm, password_confirmation: e.target.value })
                }
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword} // 🔹 Panggil fungsi yang hanya tampilkan modal
            disabled={loading}
            className="w-full py-2 px-4 text-sm bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Changing...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Change Password</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 🔹 MODAL KONFIRMASI - DITEMPATKAN DI AKHIR, DI DALAM return() */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-gray-800 mb-3">
              Are you sure you want to change your password?
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmChangePassword} // 🔹 Panggil fungsi proses sebenarnya
                className="flex-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}

                className="flex-1 text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Simple Cropper Component
function SimpleCropper({
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) {
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const container = { width: 600, height: 384 };
      const scale = Math.min(
        container.width / img.width,
        container.height / img.height
      );
      setImageSize({
        width: img.width * scale,
        height: img.height * scale,
        naturalWidth: img.width,
        naturalHeight: img.height,
      });
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (imageSize.width > 0) {
      const cropSize = Math.min(imageSize.width, imageSize.height) / zoom;
      const pixelCrop = {
        x: Math.max(
          0,
          Math.round(
            (imageSize.width / 2 - cropSize / 2 - crop.x) *
              (imageSize.naturalWidth / imageSize.width)
          )
        ),
        y: Math.max(
          0,
          Math.round(
            (imageSize.height / 2 - cropSize / 2 - crop.y) *
              (imageSize.naturalHeight / imageSize.height)
          )
        ),
        width: Math.round(
          cropSize * (imageSize.naturalWidth / imageSize.width)
        ),
        height: Math.round(
          cropSize * (imageSize.naturalHeight / imageSize.height)
        ),
      };
      onCropComplete(null, pixelCrop);
    }
  }, [crop, zoom, imageSize, onCropComplete]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !imageSize.width) return;

    const deltaX = e.clientX - lastPosRef.current.x;
    const deltaY = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    const cropSize = 400;
    const maxMoveX = (imageSize.width * zoom - cropSize) / 2;
    const maxMoveY = (imageSize.height * zoom - cropSize) / 2;

    let newX = crop.x + deltaX;
    let newY = crop.y + deltaY;

    if (newX > maxMoveX) {
      newX = maxMoveX;
    } else if (newX < -maxMoveX) {
      newX = -maxMoveX;
    }

    if (newY > maxMoveY) {
      newY = maxMoveY;
    } else if (newY < -maxMoveY) {
      newY = -maxMoveY;
    }

    onCropChange({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const cropSize = Math.min(384, 600) / zoom;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center cursor-move select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="relative"
        style={{
          width: imageSize.width * zoom,
          height: imageSize.height * zoom,
        }}
      >
        <img
          src={image}
          alt="Crop"
          className="w-full h-full object-contain"
          style={{
            transform: `translate(${crop.x}px, ${crop.y}px)`,
            pointerEvents: "none",
          }}
          draggable="false"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="hole">
              <rect width="100%" height="100%" fill="white" />
              <circle cx="50%" cy="50%" r={cropSize / 2} fill="black" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#hole)"
          />
          <circle
            cx="50%"
            cy="50%"
            r={cropSize / 2}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
    </div>
  );
}