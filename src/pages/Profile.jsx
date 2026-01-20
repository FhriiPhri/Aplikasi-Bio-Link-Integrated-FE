import { useEffect, useState, useContext, useCallback, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import {
  Camera,
  User,
  Phone,
  MessageCircle,
  ArrowLeft,
  X,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  XCircle,
  Mail,
  Edit3,
  Save,
  Upload,
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
        email: user.email || "",
      });

      setAvatarPreview(user.avatar_url || "https://i.pravatar.cc/150");
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load profile");
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
      pixelCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95,
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

        {/* Header with Back Button */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-6">
                <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-blue-500 h-24 sm:h-32"></div>

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

            {/* Right Column - Edit Profile */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
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
                              name="name"
                              autoComplete="name"
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
                              name="username"
                              autoComplete="username"
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
                                    "",
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
                          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <Save size={16} className="sm:size-[18px]" />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
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
        `}</style>
      </div>
    </Layout>
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
        container.height / img.height,
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
              (imageSize.naturalWidth / imageSize.width),
          ),
        ),
        y: Math.max(
          0,
          Math.round(
            (imageSize.height / 2 - cropSize / 2 - crop.y) *
              (imageSize.naturalHeight / imageSize.height),
          ),
        ),
        width: Math.round(
          cropSize * (imageSize.naturalWidth / imageSize.width),
        ),
        height: Math.round(
          cropSize * (imageSize.naturalHeight / imageSize.height),
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