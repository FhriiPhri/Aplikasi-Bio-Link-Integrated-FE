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
  Mail,
  Globe,
  Calendar,
  Edit3,
  Save,
  Upload,
  Trash2,
  AlertCircle,
  Info,
  Shield,
  AlertTriangle,
  LogOut,
  Bell,
  Menu,
  ChevronDown,
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
    email: "",
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
  const [activeTab, setActiveTab] = useState("profile");
  const [showSureModal, setShowSureModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!showSureModal) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSureModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showSureModal]);

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
        email: user.email || "",
      });

      setAvatarPreview(user.avatar_url || "https://i.pravatar.cc/150");
      setHasPassword(user.has_password || false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load profile");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/api/user/profile/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed");

      setShowSureModal(false);

      // opsional: kasih popup success
      alert("Account deleted successfully");

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setShowSureModal(false);
      alert("Failed to delete account");
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Spinner */}
            <div className="relative flex items-center justify-center w-16 h-16">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Text */}
            <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-3 sm:p-4 md:p-6">
        {/* Toast Notification - Responsive positioning */}
        {toast && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-50 animate-slideIn max-w-sm mx-auto sm:mx-0">
            <div
              className={`flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-xl shadow-xl backdrop-blur-sm ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={14} className="sm:size-[18px]" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircle size={14} className="sm:size-[18px]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base">
                  {toast.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-xs sm:text-sm opacity-90 truncate">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              >
                <X size={16} className="sm:size-[18px]" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Header with Back Button */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Mobile Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-3 text-center font-medium text-sm transition-all relative ${
                  activeTab === "profile"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User size={16} />
                  <span className="hidden xs:inline">Profile</span>
                </div>
                {activeTab === "profile" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-3 text-center font-medium text-sm transition-all relative ${
                  activeTab === "security"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock size={16} />
                  <span className="hidden xs:inline">Security</span>
                </div>
                {activeTab === "security" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your personal information and account security
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Profile Card */}
            {(activeTab === "profile" || window.innerWidth >= 1024) && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-6">
                  <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-blue-400 h-24 sm:h-32"></div>

                  <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
                    <div className="absolute -top-10 sm:-top-16 left-1/2 transform -translate-x-1/2">
                      <div className="relative group">
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                            <Camera
                              size={16}
                              className="sm:size-[20px] text-white"
                            />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-16 sm:pt-20 text-center">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate px-2">
                        {form.name || "Your Name"}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 truncate px-2">
                        @{form.username || "username"}
                      </p>

                      {/* Bio Section */}
                      <div className="mt-3 sm:mt-4 mb-4 sm:mb-6">
                        <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
                          <MessageCircle
                            size={14}
                            className="sm:size-[16px] text-purple-500"
                          />
                          <span className="text-xs sm:text-sm font-medium">
                            Bio
                          </span>
                        </div>
                        <div
                          className={`text-gray-600 text-xs sm:text-sm leading-relaxed px-2 sm:px-4 ${
                            !isBioExpanded ? "line-clamp-3" : ""
                          }`}
                        >
                          {form.bio || "No bio yet. Tell us about yourself..."}
                        </div>
                        {form.bio && form.bio.length > 120 && (
                          <button
                            onClick={() => setIsBioExpanded(!isBioExpanded)}
                            className="mt-1 sm:mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors"
                          >
                            {isBioExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 sm:space-y-3 bg-gray-50 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail
                              size={14}
                              className="sm:size-[18px] text-indigo-600"
                            />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-xs text-gray-500">Email</div>
                            <div className="text-xs sm:text-sm font-medium truncate">
                              {form.email || "No email"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Phone
                              size={14}
                              className="sm:size-[18px] text-purple-600"
                            />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-xs text-gray-500">Phone</div>
                            <div className="text-xs sm:text-sm font-medium truncate">
                              {form.phone_number || "Not set"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Column - Edit Profile & Settings */}
            <div
              className={`${
                activeTab === "profile" || window.innerWidth >= 1024
                  ? "lg:col-span-2"
                  : "col-span-full"
              } space-y-4 sm:space-y-6`}
            >
              {/* Desktop Tabs */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-6 py-4 font-medium text-sm transition-all flex items-center gap-3 flex-shrink-0 relative ${
                        activeTab === "profile"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activeTab === "profile"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <User size={18} />
                      </div>
                      <span>Profile</span>
                      {activeTab === "profile" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`px-6 py-4 font-medium text-sm transition-all flex items-center gap-3 flex-shrink-0 relative ${
                        activeTab === "security"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activeTab === "security"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Lock size={18} />
                      </div>
                      <span>Security</span>
                      {activeTab === "security" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Personal Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 sm:mb-6">
                          Update your personal details and contact information
                        </p>
                      </div>

                      <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-5"
                      >
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
                          {/* Full Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Full Name
                              </span>
                            </label>

                            <div className="relative group">
                              <User
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400
                   group-focus-within:text-indigo-500 transition"
                              />

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.name}
                                onChange={(e) =>
                                  setForm({ ...form, name: e.target.value })
                                }
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>

                          {/* Username */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Username
                              </span>
                            </label>

                            <div className="relative group">
                              <span
                                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2
                   text-gray-400 font-medium select-none text-sm sm:text-base
                   group-focus-within:text-indigo-500 transition"
                              >
                                @
                              </span>

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.username}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    username: e.target.value.toLowerCase(),
                                  })
                                }
                                placeholder="username"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Email Address
                              </span>
                            </label>

                            <div className="relative">
                              <Mail
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              />

                              <input
                                type="email"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-xl
                   focus:outline-none text-gray-900 placeholder-gray-400 cursor-not-allowed text-sm sm:text-base"
                                value={form.email}
                                readOnly
                              />
                            </div>

                            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                              Contact admin to change email
                            </p>
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Phone Number
                              </span>
                            </label>

                            <div className="relative group">
                              <Phone
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400
                   group-focus-within:text-indigo-500 transition"
                              />

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.phone_number}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    phone_number: e.target.value.replace(
                                      /[^0-9+]/g,
                                      ""
                                    ),
                                  })
                                }
                                placeholder="+62"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                <Edit3
                                  size={14}
                                  className="sm:size-[16px] text-gray-400"
                                />
                                Bio
                              </span>
                            </label>
                            <textarea
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-h-[100px] sm:min-h-[120px] text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                              value={form.bio}
                              onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                              }
                              placeholder="Tell about yourself..."
                              maxLength={500}
                            />
                            <div className="flex items-center justify-between mt-1 sm:mt-2">
                              <p className="text-xs text-gray-500">
                                Brief description for your profile
                              </p>
                              <span className="text-xs text-gray-500">
                                {form.bio.length}/500
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-gray-200">
                          <button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <Save size={16} className="sm:size-[18px]" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6 sm:space-y-8">
                      {/* Password Settings */}
                      <div>
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <ShieldCheck
                              size={20}
                              className="sm:size-[24px] text-indigo-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Password & Security
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Manage your password and account protection
                            </p>
                          </div>
                        </div>
                        <PasswordSettings
                          hasPassword={hasPassword}
                          showToast={showToast}
                        />
                      </div>

                      {/* Danger Zone */}
                      <div className="border-t border-gray-200 pt-6 sm:pt-8">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle
                              size={20}
                              className="sm:size-[24px] text-red-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Danger Zone
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Irreversible actions that affect your account
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Delete Account */}
                          <div className="bg-red-50 border border-red-100 rounded-xl p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                                  <Trash2
                                    size={16}
                                    className="sm:size-[20px] text-red-600"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                    Delete Account
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    Permanently delete your account and all
                                    associated data
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setShowSureModal(true)}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                              >
                                Delete Account
                              </button>
                            </div>
                          </div>

                          {/* Important Notice */}
                          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Info
                                size={16}
                                className="sm:size-[20px] text-yellow-600 flex-shrink-0 mt-0.5"
                              />
                              <div>
                                <p className="text-xs sm:text-sm text-yellow-800 font-medium mb-1">
                                  Important Notice
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Deleting your account is irreversible. All
                                  your data, posts, and connections will be
                                  permanently removed.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Content (without tab wrapper) */}
              <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Personal Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 sm:mb-6">
                          Update your personal details and contact information
                        </p>
                      </div>

                      <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-5"
                      >
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
                          {/* Full Name */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Full Name
                              </span>
                            </label>

                            <div className="relative group">
                              <User
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400
                   group-focus-within:text-indigo-500 transition"
                              />

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.name}
                                onChange={(e) =>
                                  setForm({ ...form, name: e.target.value })
                                }
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>

                          {/* Username */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Username
                              </span>
                            </label>

                            <div className="relative group">
                              <span
                                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2
                   text-gray-400 font-medium select-none text-sm sm:text-base
                   group-focus-within:text-indigo-500 transition"
                              >
                                @
                              </span>

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.username}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    username: e.target.value.toLowerCase(),
                                  })
                                }
                                placeholder="username"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Email Address
                              </span>
                            </label>

                            <div className="relative">
                              <Mail
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              />

                              <input
                                type="email"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-xl
                   focus:outline-none text-gray-900 placeholder-gray-400 cursor-not-allowed text-sm sm:text-base"
                                value={form.email}
                                readOnly
                              />
                            </div>

                            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                              Contact admin to change email
                            </p>
                          </div>

                          {/* Phone Number */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                Phone Number
                              </span>
                            </label>

                            <div className="relative group">
                              <Phone
                                size={14}
                                className="sm:size-[16px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400
                   group-focus-within:text-indigo-500 transition"
                              />

                              <input
                                type="text"
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                value={form.phone_number}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    phone_number: e.target.value.replace(
                                      /[^0-9+]/g,
                                      ""
                                    ),
                                  })
                                }
                                placeholder="+62"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              <span className="flex items-center gap-2">
                                <Edit3
                                  size={14}
                                  className="sm:size-[16px] text-gray-400"
                                />
                                Bio
                              </span>
                            </label>
                            <textarea
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-h-[100px] sm:min-h-[120px] text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                              value={form.bio}
                              onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                              }
                              placeholder="Tell about yourself..."
                              maxLength={500}
                            />
                            <div className="flex items-center justify-between mt-1 sm:mt-2">
                              <p className="text-xs text-gray-500">
                                Brief description for your profile
                              </p>
                              <span className="text-xs text-gray-500">
                                {form.bio.length}/500
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-gray-200">
                          <button
                            type="submit"
                            className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <Save size={16} className="sm:size-[18px]" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6 sm:space-y-8">
                      {/* Password Settings */}
                      <div>
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <ShieldCheck
                              size={20}
                              className="sm:size-[24px] text-indigo-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Password & Security
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Manage your password and account protection
                            </p>
                          </div>
                        </div>
                        <PasswordSettings
                          hasPassword={hasPassword}
                          showToast={showToast}
                        />
                      </div>

                      {/* Danger Zone */}
                      <div className="border-t border-gray-200 pt-6 sm:pt-8">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle
                              size={20}
                              className="sm:size-[24px] text-red-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Danger Zone
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Irreversible actions that affect your account
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Delete Account */}
                          <div className="bg-red-50 border border-red-100 rounded-xl p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                                  <Trash2
                                    size={16}
                                    className="sm:size-[20px] text-red-600"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                    Delete Account
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    Permanently delete your account and all
                                    associated data
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setShowSureModal(true)}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                              >
                                Delete Account
                              </button>
                            </div>
                          </div>

                          {/* Important Notice */}
                          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Info
                                size={16}
                                className="sm:size-[20px] text-yellow-600 flex-shrink-0 mt-0.5"
                              />
                              <div>
                                <p className="text-xs sm:text-sm text-yellow-800 font-medium mb-1">
                                  Important Notice
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Deleting your account is irreversible. All
                                  your data, posts, and connections will be
                                  permanently removed.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Crop Modal - Responsive */}
        {showAvatarModal && imageSrc && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Edit Profile Picture
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Crop and adjust your photo
                  </p>
                </div>
                <button
                  onClick={handleCancelUpload}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={uploading}
                >
                  <X size={18} className="sm:size-[20px]" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="relative w-full h-[300px] sm:h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden mb-4 sm:mb-6">
                  <SimpleCropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <ZoomOut
                      size={18}
                      className="sm:size-[20px] text-gray-400"
                    />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                    />
                    <ZoomIn
                      size={18}
                      className="sm:size-[20px] text-gray-400"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 border border-white rounded-sm"></div>
                      <span>Drag to reposition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-dashed border-white rounded-full"></div>
                      <span>Slide to zoom</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleCancelUpload}
                    className="flex-1 py-2.5 sm:py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    disabled={uploading}
                  >
                    <X size={16} className="sm:size-[18px]" />
                    Cancel
                  </button>
                  <button
                    onClick={handleAvatarUpload}
                    className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="sm:size-[18px]" />
                        Update Profile Picture
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal - Responsive */}
        {showSureModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
            onClick={() => setShowSureModal(false)}
          >
            <div
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle
                      size={24}
                      className="sm:size-[28px] text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Delete Your Account?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle
                      size={18}
                      className="sm:size-[20px] text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs sm:text-sm text-red-800 font-medium mb-1">
                        Warning: This will permanently delete:
                      </p>
                      <ul className="text-xs text-red-700 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Your profile and personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          All your posts and content
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Your connections and followers
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Account history and activity
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <AlertTriangle
                        size={16}
                        className="sm:size-[20px] text-gray-600"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Are you absolutely sure you want to proceed?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setShowSureModal(false)}
                      className="flex-1 py-2.5 sm:py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 border border-gray-300 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Trash2 size={16} className="sm:size-[18px]" />
                      Delete Account
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500 pt-2">
                    By clicking "Delete Account", you agree to permanently
                    remove all your data.
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
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-slideIn {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out;
          }
          
          /* Responsive line clamp for bio */
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Custom range slider - responsive */
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          }
          
          @media (max-width: 640px) {
            input[type="range"]::-webkit-slider-thumb {
              height: 16px;
              width: 16px;
            }
          }
          
          /* Responsive grid utilities */
          @media (min-width: 640px) {
            .xs\\:inline {
              display: inline;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}

// Password Settings Component (Enhanced) - Made responsive
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
    <div className="space-y-4 sm:space-y-6">
      {!hasPassword ? (
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle
                size={18}
                className="sm:size-[20px] text-blue-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
                  Set a password to enable email login
                </p>
                <p className="text-xs text-blue-600">
                  This will allow you to log in using your email and password
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound
                    size={14}
                    className="sm:size-[16px] text-gray-400"
                  />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 pr-10 sm:pr-11 text-sm sm:text-base"
                  value={setPasswordForm.password}
                  onChange={(e) => {
                    setSetPasswordForm({
                      ...setPasswordForm,
                      password: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPasswords.newPassword ? (
                    <EyeOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:size-[18px]" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {setPasswordForm.password && (
                <div className="mt-2 sm:mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Password strength
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= passwordStrength
                            ? getStrengthColor(passwordStrength)
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound
                    size={14}
                    className="sm:size-[16px] text-gray-400"
                  />
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 pr-10 sm:pr-11 text-sm sm:text-base"
                  value={setPasswordForm.password_confirmation}
                  onChange={(e) =>
                    setSetPasswordForm({
                      ...setPasswordForm,
                      password_confirmation: e.target.value,
                    })
                  }
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={handleSetPassword}
                disabled={
                  loading ||
                  !setPasswordForm.password ||
                  !setPasswordForm.password_confirmation
                }
                className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span>Setting Password...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} className="sm:size-[18px]" />
                    <span>Set Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <Lock size={14} className="sm:size-[16px] text-gray-400" />
                  Current Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 pr-10 sm:pr-11 text-sm sm:text-base"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPasswords.currentPassword ? (
                    <EyeOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound
                    size={14}
                    className="sm:size-[16px] text-gray-400"
                  />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 pr-10 sm:pr-11 text-sm sm:text-base"
                  value={changePasswordForm.password}
                  onChange={(e) =>
                    setChangePasswordForm({
                      ...changePasswordForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPasswords.newPassword ? (
                    <EyeOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <KeyRound
                    size={14}
                    className="sm:size-[16px] text-gray-400"
                  />
                  Confirm New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmNewPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 pr-10 sm:pr-11 text-sm sm:text-base"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPasswords.confirmNewPassword ? (
                    <EyeOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleChangePassword}
                disabled={loading || !changePasswordForm.current_password}
                className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="sm:size-[18px]" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Responsive */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99] p-3 sm:p-4 animate-scaleIn">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <AlertCircle
                    size={20}
                    className="sm:size-[24px] text-indigo-600"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Are you sure you want to change your password?
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    You will be logged out from all other devices after changing
                    your password.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2.5 sm:py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmChangePassword}
                    className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Check size={16} className="sm:size-[18px]" />
                    Confirm Change
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

// Simple Cropper Component (Enhanced) - Made responsive
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
  const containerRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
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

    const cropSize = 300; // Reduced for mobile
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

  const cropSize = Math.min(300, 400) / zoom; // Responsive crop size

  return (
    <div
      ref={containerRef}
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
          <circle
            cx="50%"
            cy="50%"
            r={cropSize / 2 - 1}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white text-xs text-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            {Math.round(cropSize)}px
          </div>
        </div>
      </div>
    </div>
  );
}