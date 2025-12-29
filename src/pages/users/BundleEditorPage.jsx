import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Edit2,
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";

function BundleEditorPage() {
  const { bundleId } = useParams();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [error, setError] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // State untuk toggle preview di mobile
  const [mobileShowPreview, setMobileShowPreview] = useState(false);

  // Show toast notification
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Form states
  const [bundleForm, setBundleForm] = useState({
    name: "",
    description: "",
    instagram_url: "",
    github_url: "",
    tiktok_url: "",
    facebook_url: "",
    x_url: "",
    youtube_url: "",
  });

  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
  });

  const [editLinkForm, setEditLinkForm] = useState({
    name: "",
    url: "",
  });

  useEffect(() => {
    if (bundleId) {
      fetchBundleData();
      fetchThemes();
    } else {
      setError("Bundle ID is missing");
      setLoading(false);
    }
  }, [bundleId]);

  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/themes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setThemes(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching themes:", err);
    } finally {
      setLoadingThemes(false);
    }
  };

  const fetchBundleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const bundleResponse = await fetch(`/api/user/bundles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!bundleResponse.ok) {
        throw new Error("Failed to fetch bundles");
      }

      const bundleData = await bundleResponse.json();
      const foundBundle = bundleData.data.find((b) => b.id === bundleId);

      if (!foundBundle) {
        throw new Error("Bundle not found");
      }

      console.log("Found bundle:", foundBundle);

      setBundle(foundBundle);
      setSelectedThemeId(foundBundle.theme_id || null);
      setBundleForm({
        name: foundBundle.name || "",
        description: foundBundle.description || "",
        instagram_url: foundBundle.instagram_url || "",
        github_url: foundBundle.github_url || "",
        tiktok_url: foundBundle.tiktok_url || "",
        facebook_url: foundBundle.facebook_url || "",
        x_url: foundBundle.x_url || "",
        youtube_url: foundBundle.youtube_url || "",
      });

      if (foundBundle.profile_image_url) {
        setProfileImagePreview(foundBundle.profile_image_url);
      } else {
        setProfileImagePreview(null);
      }

      // Fetch links
      const linksResponse = await fetch(`/api/user/bundles/${bundleId}/links`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setLinks(linksData.data || []);
      }
    } catch (err) {
      console.error("Error loading bundle:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showNotification("Please select an image file", "error");
        return;
      }

      if (file.size > 2048 * 1024) {
        showNotification("Image size must be less than 2MB", "error");
        return;
      }

      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBundleUpdate = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", bundleForm.name);
      formData.append("description", bundleForm.description || "");
      formData.append("instagram_url", bundleForm.instagram_url || "");
      formData.append("github_url", bundleForm.github_url || "");
      formData.append("tiktok_url", bundleForm.tiktok_url || "");
      formData.append("facebook_url", bundleForm.facebook_url || "");
      formData.append("x_url", bundleForm.x_url || "");
      formData.append("youtube_url", bundleForm.youtube_url || "");

      if (selectedThemeId) {
        formData.append("theme_id", selectedThemeId);
      }

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      formData.append("_method", "PUT");

      const response = await fetch(`/api/user/bundles/${bundleId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update bundle");

      const result = await response.json();

      const profileImageUrl = result.data.profile_image_url ?? null;

      setBundle({
        ...result.data,
        profile_image_url: profileImageUrl,
      });

      setSelectedThemeId(result.data.theme_id || null);

      setBundleForm({
        name: result.data.name || "",
        description: result.data.description || "",
        instagram_url: result.data.instagram_url || "",
        github_url: result.data.github_url || "",
        tiktok_url: result.data.tiktok_url || "",
        facebook_url: result.data.facebook_url || "",
        x_url: result.data.x_url || "",
        youtube_url: result.data.youtube_url || "",
      });

      setProfileImagePreview(profileImageUrl);

      const linksResponse = await fetch(`/api/user/bundles/${bundleId}/links`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setLinks(linksData.data || []);
      }

      setProfileImageFile(null);

      showNotification("Bundle updated successfully!", "success");
    } catch (err) {
      console.error("Update error:", err);
      showNotification("Error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();

    if (!newLink.name.trim() || !newLink.url.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/user/links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          bundle_id: bundleId,
          name: newLink.name,
          url: newLink.url,
        }),
      });

      if (!response.ok) throw new Error("Failed to add link");

      setNewLink({ name: "", url: "" });
      fetchBundleData();
      showNotification("Link added successfully!", "success");
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const startEditLink = (link) => {
    setEditingLinkId(link.id);
    setEditLinkForm({
      name: link.name,
      url: link.url,
    });
  };

  const handleUpdateLink = async (linkId) => {
    if (!editLinkForm.name.trim() || !editLinkForm.url.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/user/links/${linkId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(editLinkForm),
      });

      if (!response.ok) throw new Error("Failed to update link");

      setEditingLinkId(null);
      fetchBundleData();
      showNotification("Link updated successfully!", "success");
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/user/links/${linkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete link");

      fetchBundleData();
      showNotification("Link deleted successfully!", "success");
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const getSelectedTheme = () => {
    return themes.find((t) => t.id === selectedThemeId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading bundle...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="text-center bg-white rounded-xl shadow-sm border border-red-100 p-8 max-w-md w-full">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Bundle
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/bundles-page")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Bundles
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        * {
          font-family: "Inter", sans-serif;
        }

        /* Compact iPhone Mockup */
        .iphone-mockup-compact {
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
          position: relative;
        }

        .iphone-frame-compact {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 38px;
          padding: 10px;
          box-shadow: 0 0 0 2px #4a4a4a, 0 20px 50px rgba(0, 0, 0, 0.4),
            inset 0 1px 3px rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .iphone-notch-compact {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 22px;
          background: #0a0a0a;
          border-radius: 0 0 14px 14px;
          z-index: 10;
          box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .iphone-speaker-compact {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 4px;
          background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
          border-radius: 2px;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .iphone-camera-compact {
          position: absolute;
          top: 7px;
          right: 24px;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #1a2a3a 30%, #0a0a0a 70%);
          border: 1.5px solid #2a2a2a;
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .iphone-camera-compact::after {
          content: "";
          position: absolute;
          top: 1.5px;
          left: 1.5px;
          width: 2px;
          height: 2px;
          background: rgba(100, 150, 255, 0.6);
          border-radius: 50%;
        }

        .iphone-screen-compact {
          background: #ffffff;
          border-radius: 32px;
          overflow: hidden;
          height: 560px;
          position: relative;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
        }

        .iphone-content-compact {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .iphone-content-compact::-webkit-scrollbar {
          width: 3px;
        }

        .iphone-content-compact::-webkit-scrollbar-track {
          background: transparent;
        }

        .iphone-content-compact::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }

        .iphone-content-compact::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.25);
        }

        /* Theme Card Styling */
        .theme-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .theme-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .theme-card.selected {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .top-bar-mobile {
            padding: 12px 16px !important;
          }

          .top-bar-mobile h1 {
            font-size: 16px !important;
          }

          .top-bar-mobile p {
            font-size: 11px !important;
          }

          .mobile-button {
            padding: 8px 12px !important;
            font-size: 14px !important;
          }

          .mobile-button svg {
            width: 16px !important;
            height: 16px !important;
          }

          .mobile-section {
            padding: 16px !important;
          }

          .mobile-section h2 {
            font-size: 16px !important;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 1279px) {
          .iphone-mockup-compact {
            max-width: 240px;
          }

          .iphone-screen-compact {
            height: 480px;
          }
        }

        @media (max-width: 640px) {
          .iphone-mockup-compact {
            max-width: 260px;
          }

          .iphone-screen-compact {
            height: 500px;
          }
        }

        /* Toast Notification Styles */
        .toast-notification {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
          max-width: 400px;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-notification.hiding {
          animation: slideOutRight 0.3s ease-out forwards;
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .toast-notification {
            top: 16px;
            right: 16px;
            left: 16px;
            max-width: none;
          }
        }

        /* Mobile Preview Toggle Styles */
        .mobile-preview-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 60;
          display: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .mobile-preview-toggle:hover {
          transform: scale(1.05);
        }

        @media (max-width: 1279px) {
          .mobile-preview-toggle {
            display: flex;
          }
        }

        /* Mobile Preview Modal Animations */
        .preview-overlay {
          animation: fadeIn 0.2s ease-out;
        }

        .preview-content-modal {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .preview-overlay.closing .preview-content-modal {
          animation: slideDown 0.3s ease-out forwards;
        }

        .preview-overlay.closing {
          animation: fadeIn 0.2s ease-out reverse forwards;
        }

        @media (min-width: 1280px) {
          .preview-overlay {
            position: static !important;
            background: transparent !important;
            animation: none !important;
          }

          .preview-content-modal {
            animation: none !important;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${!showToast ? "hiding" : ""}`}>
          <div
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 ${
              toastType === "success"
                ? "bg-white border-green-500"
                : "bg-white border-red-500"
            }`}
          >
            <div className="flex-shrink-0">
              {toastType === "success" ? (
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  toastType === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - Mobile Responsive */}
        <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 top-bar-mobile">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <button
                  onClick={() => navigate("/bundles-page")}
                  className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 font-medium flex-shrink-0"
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <div className="border-l border-gray-300 pl-2 sm:pl-4 min-w-0">
                  <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                    {bundle?.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-mono truncate">
                    /{bundle?.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm mobile-button"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="hidden md:inline">
                    {showPreview ? "Hide" : "Show"} Preview
                  </span>
                  <span className="md:hidden">Preview</span>
                </button>
                <button
                  onClick={handleBundleUpdate}
                  disabled={saving}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium shadow-sm transition-all text-sm mobile-button"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span className="hidden sm:inline">
                    {saving ? "Saving..." : "Save"}
                  </span>
                  <span className="sm:hidden">💾</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Toggle Button */}
        <button
          onClick={() => setMobileShowPreview(!mobileShowPreview)}
          className="mobile-preview-toggle lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          aria-label={mobileShowPreview ? "Hide Preview" : "Show Preview"}
        >
          {mobileShowPreview ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>

        {/* Mobile Preview Modal */}
        {mobileShowPreview && (
          <div
            className="preview-overlay fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden flex items-end justify-center p-4"
            onClick={() => setMobileShowPreview(false)}
          >
            <div
              className="preview-content-modal bg-white rounded-t-2xl rounded-b-none w-full max-w-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Preview Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button
                  onClick={() => setMobileShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close Preview"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4">
                <div className="text-center mb-3">
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    📱 LIVE PREVIEW
                  </span>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {getSelectedTheme()?.name ||
                      bundle?.theme?.name ||
                      "Default"}
                  </p>
                </div>

                <div className="iphone-mockup-compact">
                  <div className="iphone-frame-compact">
                    <div className="iphone-notch-compact">
                      <div className="iphone-speaker-compact"></div>
                      <div className="iphone-camera-compact"></div>
                    </div>

                    <div className="iphone-screen-compact">
                      <div
                        data-theme={
                          getSelectedTheme()?.name ||
                          bundle?.theme?.name ||
                          "light"
                        }
                        className="iphone-content-compact bg-base-100"
                      >
                        <div className="p-6 text-center min-h-full">
                          {/* Avatar */}
                          <div className="w-16 h-16 mx-auto mb-3 mt-6">
                            {profileImagePreview ? (
                              <img
                                src={profileImagePreview}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-base-200 shadow-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-base-300 rounded-full flex items-center justify-center border-2 border-base-200">
                                <ImageIcon
                                  size={20}
                                  className="text-base-content/30"
                                />
                              </div>
                            )}
                          </div>

                          {/* Bundle Name */}
                          <h3 className="text-sm font-bold mb-1.5 text-base-content px-2">
                            {bundleForm.name || "Your Name"}
                          </h3>

                          {/* Description */}
                          {bundleForm.description && (
                            <p className="text-xs text-base-content/70 mb-4 px-2 line-clamp-2">
                              {bundleForm.description}
                            </p>
                          )}

                          {/* Social Icons */}
                          <div className="flex gap-1.5 justify-center mb-4 flex-wrap px-2">
                            {bundleForm.instagram_url && (
                              <a
                                href={bundleForm.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </a>
                            )}
                            {bundleForm.github_url && (
                              <a
                                href={bundleForm.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-gray-800 hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                              </a>
                            )}
                            {bundleForm.tiktok_url && (
                              <a
                                href={bundleForm.tiktok_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-black hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                              </a>
                            )}
                            {bundleForm.youtube_url && (
                              <a
                                href={bundleForm.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-red-600 hover:bg-red-700 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                              </a>
                            )}
                            {bundleForm.facebook_url && (
                              <a
                                href={bundleForm.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-blue-600 hover:bg-blue-700 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                              </a>
                            )}
                            {bundleForm.x_url && (
                              <a
                                href={bundleForm.x_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-xs bg-black hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </a>
                            )}
                          </div>

                          {/* Custom Links */}
                          <div className="space-y-2 px-2">
                            {links.slice(0, 3).map((link) => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm w-full text-xs font-medium shadow-sm normal-case"
                              >
                                {link.name}
                              </a>
                            ))}
                            {links.length > 3 && (
                              <p className="text-xs text-base-content/40 italic pt-1">
                                +{links.length - 3} more links
                              </p>
                            )}
                            {links.length === 0 && !bundleForm.description && (
                              <p className="text-base-content/40 py-6 text-xs">
                                Your links will appear here
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[1600px]">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Sidebar - Theme Selection */}
            <div className="xl:col-span-3 space-y-4 sm:space-y-6">
              {/* Theme Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mobile-section xl:sticky xl:top-24">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Palette size={18} className="text-gray-700 sm:w-5 sm:h-5" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Choose Theme
                  </h2>
                </div>

                {loadingThemes ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-gray-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Loading themes...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`theme-card w-full p-2.5 sm:p-3 border-2 rounded-lg text-left transition-all ${
                          selectedThemeId === theme.id
                            ? "selected border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">
                              {theme.name}
                            </h3>
                            {theme.description && (
                              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">
                                {theme.description}
                              </p>
                            )}
                          </div>
                          {selectedThemeId === theme.id && (
                            <div className="ml-2 flex-shrink-0">
                              <Check
                                size={14}
                                className="text-blue-600 sm:w-4 sm:h-4"
                              />
                            </div>
                          )}
                        </div>
                        {/* Theme color preview */}
                        <div className="flex gap-1 mt-1.5 sm:mt-2">
                          {theme.primary_color && (
                            <div
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-gray-300"
                              style={{ backgroundColor: theme.primary_color }}
                              title="Primary"
                            />
                          )}
                          {theme.secondary_color && (
                            <div
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-gray-300"
                              style={{ backgroundColor: theme.secondary_color }}
                              title="Secondary"
                            />
                          )}
                          {theme.background_color && (
                            <div
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-gray-300"
                              style={{
                                backgroundColor: theme.background_color,
                              }}
                              title="Background"
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center - Bundle Editor */}
            <div className="xl:col-span-6 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mobile-section">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
                  Bundle Information
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {/* Profile Image Upload */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                            <ImageIcon
                              size={24}
                              className="text-gray-400 sm:w-8 sm:h-8"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="profile-image"
                          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer font-medium transition-colors text-xs sm:text-sm"
                        >
                          <Upload
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                          Choose Image
                        </label>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                          JPG, JPEG, PNG. Max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Bundle Name
                    </label>
                    <input
                      type="text"
                      value={bundleForm.name}
                      onChange={(e) =>
                        setBundleForm({ ...bundleForm, name: e.target.value })
                      }
                      className="w-full text-black px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={bundleForm.description}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          description: e.target.value,
                        })
                      }
                      rows="4"
                      placeholder="Tell people about yourself..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mobile-section">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
                  Custom Links
                </h2>

                {/* Add New Link Form */}
                <form
                  onSubmit={handleAddLink}
                  className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <input
                      type="text"
                      placeholder="Link Name"
                      value={newLink.name}
                      onChange={(e) =>
                        setNewLink({ ...newLink, name: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base"
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Add Link
                    </button>
                  </div>
                </form>

                {/* Links List */}
                <div className="space-y-2">
                  {links.length === 0 ? (
                    <p className="text-center text-gray-500 py-3 sm:py-4 text-xs sm:text-sm">
                      No links yet. Add your first link above!
                    </p>
                  ) : (
                    links.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <GripVertical
                          size={16}
                          className="text-gray-400 cursor-move flex-shrink-0 sm:w-[18px] sm:h-[18px]"
                        />

                        {editingLinkId === link.id ? (
                          <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                            <input
                              type="text"
                              value={editLinkForm.name}
                              onChange={(e) =>
                                setEditLinkForm({
                                  ...editLinkForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2.5 sm:px-3 py-1.5 bg-white border border-gray-300 rounded text-xs sm:text-sm"
                              placeholder="Link Name"
                            />
                            <input
                              type="url"
                              value={editLinkForm.url}
                              onChange={(e) =>
                                setEditLinkForm({
                                  ...editLinkForm,
                                  url: e.target.value,
                                })
                              }
                              className="w-full px-2.5 sm:px-3 py-1.5 bg-white border border-gray-300 rounded text-xs sm:text-sm"
                              placeholder="https://example.com"
                            />
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                              {link.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                              {link.url}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-1 flex-shrink-0">
                          {editingLinkId === link.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateLink(link.id)}
                                className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              >
                                <Check
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                              <button
                                onClick={() => setEditingLinkId(null)}
                                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              >
                                <X
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditLink(link)}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit2
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mobile-section">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
                  Social Media Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={bundleForm.instagram_url}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          instagram_url: e.target.value,
                        })
                      }
                      placeholder="https://instagram.com/username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={bundleForm.github_url}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          github_url: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      TikTok
                    </label>
                    <input
                      type="url"
                      value={bundleForm.tiktok_url}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          tiktok_url: e.target.value,
                        })
                      }
                      placeholder="https://tiktok.com/@username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={bundleForm.youtube_url}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          youtube_url: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/@username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={bundleForm.facebook_url}
                      onChange={(e) =>
                        setBundleForm({
                          ...bundleForm,
                          facebook_url: e.target.value,
                        })
                      }
                      placeholder="https://facebook.com/username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      X (Twitter)
                    </label>
                    <input
                      type="url"
                      value={bundleForm.x_url}
                      onChange={(e) =>
                        setBundleForm({ ...bundleForm, x_url: e.target.value })
                      }
                      placeholder="https://x.com/username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Compact iPhone Preview (Desktop) */}
            {showPreview && (
              <div className="xl:col-span-3 hidden xl:block">
                <div className="xl:sticky xl:top-24">
                  <div className="text-center mb-2 sm:mb-3">
                    <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                      📱 LIVE PREVIEW
                    </span>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 font-medium">
                      {getSelectedTheme()?.name ||
                        bundle?.theme?.name ||
                        "Default"}
                    </p>
                  </div>

                  <div className="iphone-mockup-compact">
                    <div className="iphone-frame-compact">
                      <div className="iphone-notch-compact">
                        <div className="iphone-speaker-compact"></div>
                        <div className="iphone-camera-compact"></div>
                      </div>

                      <div className="iphone-screen-compact">
                        <div
                          data-theme={
                            getSelectedTheme()?.name ||
                            bundle?.theme?.name ||
                            "light"
                          }
                          className="iphone-content-compact bg-base-100"
                        >
                          <div className="p-4 sm:p-6 text-center min-h-full">
                            {/* Avatar */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 mt-4 sm:mt-6">
                              {profileImagePreview ? (
                                <img
                                  src={profileImagePreview}
                                  alt="Profile"
                                  className="w-full h-full rounded-full object-cover border-2 border-base-200 shadow-lg"
                                />
                              ) : (
                                <div className="w-full h-full bg-base-300 rounded-full flex items-center justify-center border-2 border-base-200">
                                  <ImageIcon
                                    size={18}
                                    className="text-base-content/30 sm:w-5 sm:h-5"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Bundle Name */}
                            <h3 className="text-xs sm:text-sm font-bold mb-1 sm:mb-1.5 text-base-content px-2">
                              {bundleForm.name || "Your Name"}
                            </h3>

                            {/* Description */}
                            {bundleForm.description && (
                              <p className="text-[10px] sm:text-xs text-base-content/70 mb-3 sm:mb-4 px-2 line-clamp-2">
                                {bundleForm.description}
                              </p>
                            )}

                            {/* Social Icons */}
                            <div className="flex gap-1 sm:gap-1.5 justify-center mb-3 sm:mb-4 flex-wrap px-2">
                              {bundleForm.instagram_url && (
                                <a
                                  href={bundleForm.instagram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                  </svg>
                                </a>
                              )}
                              {bundleForm.github_url && (
                                <a
                                  href={bundleForm.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-gray-800 hover:bg-gray-900 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                </a>
                              )}
                              {bundleForm.tiktok_url && (
                                <a
                                  href={bundleForm.tiktok_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-black hover:bg-gray-900 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                  </svg>
                                </a>
                              )}
                              {bundleForm.youtube_url && (
                                <a
                                  href={bundleForm.youtube_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-red-600 hover:bg-red-700 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                  </svg>
                                </a>
                              )}
                              {bundleForm.facebook_url && (
                                <a
                                  href={bundleForm.facebook_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-blue-600 hover:bg-blue-700 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                  </svg>
                                </a>
                              )}
                              {bundleForm.x_url && (
                                <a
                                  href={bundleForm.x_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-xs bg-black hover:bg-gray-900 border-0 text-white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                </a>
                              )}
                            </div>

                            {/* Custom Links */}
                            <div className="space-y-1.5 sm:space-y-2 px-2">
                              {links.slice(0, 3).map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm w-full text-[10px] sm:text-xs font-medium shadow-sm normal-case"
                                >
                                  {link.name}
                                </a>
                              ))}
                              {links.length > 3 && (
                                <p className="text-[10px] sm:text-xs text-base-content/40 italic pt-1">
                                  +{links.length - 3} more links
                                </p>
                              )}
                              {links.length === 0 &&
                                !bundleForm.description && (
                                  <p className="text-base-content/40 py-4 sm:py-6 text-[10px] sm:text-xs">
                                    Your links will appear here
                                  </p>
                                )}
                            </div>
                          </div>
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
    </Layout>
  );
}

export default BundleEditorPage;