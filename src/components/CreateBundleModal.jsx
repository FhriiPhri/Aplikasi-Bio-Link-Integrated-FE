import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CreateBundleModal({ onClose }) {
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [bundleName, setBundleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/themes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch themes");

      const result = await response.json();
      setThemes(result.data);
    } catch (err) {
      alert("Error loading themes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTheme) {
      alert("Please select a theme");
      return;
    }

    if (!bundleName.trim()) {
      alert("Please enter a bundle name");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/user/bundles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: bundleName,
          theme_id: selectedTheme,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create bundle");
      }

      const result = await response.json();

      onClose();
      navigate(`/bundles/${result.data.id}/edit`);
    } catch (err) {
      alert("Error: " + err.message);
      setSubmitting(false);
    }
  };

  // Get selected theme name
  const selectedThemeData = themes.find((t) => t.id === selectedTheme);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") triggerClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const triggerClose = () => {
    if (submitting) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // durasi animasi
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
    bg-black bg-opacity-50 transition-opacity duration-200
    ${isClosing ? "opacity-0" : "opacity-100"}
  `}
      onClick={triggerClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
    bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto
    transform transition-all duration-200
    ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
  `}
      >
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
            .mobile-hide-preview .iphone-mockup-compact {
              display: none;
            }

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
        `}</style>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Bundle
            </h2>
            <p className="text-sm text-gray-600">
              Choose a theme and give your bundle a name
            </p>
          </div>
          <button
            onClick={triggerClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading themes...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Left Side - Form */}
              <div className="space-y-6">
                {/* Bundle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bundle Name *
                  </label>
                  <input
                    type="text"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    placeholder="e.g., My Social Links"
                    required
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border-2 border-gray-300 rounded-lgshadow-sm transition-all focus:outline-none focus:border-blue-600 focus:bg-blue-50 focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  />
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Theme *
                  </label>
                  <div className="grid grid-cols-2 text-black gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() =>
                          !submitting && setSelectedTheme(theme.id)
                        }
                        className={`
                          border-2 rounded-lg p-3 cursor-pointer transition-all text-center
                          ${submitting ? "opacity-50 cursor-not-allowed" : ""}
                          ${
                            selectedTheme === theme.id
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-300 hover:border-gray-400 hover:shadow"
                          }
                        `}
                      >
                        <div
                          className={`
                          w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center
                          ${
                            selectedTheme === theme.id
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }
                        `}
                        >
                          <span
                            className={`text-lg font-bold ${
                              selectedTheme === theme.id
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {theme.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium text-xs capitalize">
                          {theme.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  {!selectedTheme && (
                    <p className="text-red-500 text-sm mt-2">
                      * Please select a theme
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side - Preview */}
              <div className="lg:border-l lg:pl-6">
                <div className="sticky top-6">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Preview
                  </h3>

                  <div className="iphone-mockup-compact">
                    <div className="iphone-frame-compact">
                      {/* Notch */}
                      <div className="iphone-notch-compact">
                        <div className="iphone-speaker-compact"></div>
                        <div className="iphone-camera-compact"></div>
                      </div>

                      {/* Screen */}
                      <div className="iphone-screen-compact">
                        <div
                          className="iphone-content-compact"
                          data-theme={selectedThemeData?.name || "light"}
                        >
                          {selectedTheme ? (
                            <div className="min-h-full bg-base-100 px-4 pt-10 pb-6 text-center">
                              {/* Avatar */}
                              <div className="w-20 h-20 bg-base-300 rounded-full mx-auto mb-3"></div>

                              {/* Bundle Name */}
                              <h4 className="text-lg font-bold mb-3 text-base-content">
                                {bundleName || "Your Bundle Name"}
                              </h4>

                              {/* Social Icons */}
                              <div className="flex gap-2 justify-center mb-4">
                                <div className="btn btn-circle btn-sm bg-pink-500 border-0"></div>
                                <div className="btn btn-circle btn-sm bg-gray-800 border-0"></div>
                                <div className="btn btn-circle btn-sm bg-blue-600 border-0"></div>
                              </div>

                              {/* Links */}
                              <div className="space-y-2 max-w-xs mx-auto">
                                <div className="btn btn-primary btn-sm w-full">
                                  Sample Link 1
                                </div>
                                <div className="btn btn-primary btn-sm w-full">
                                  Sample Link 2
                                </div>
                                <div className="btn btn-primary btn-sm w-full">
                                  Sample Link 3
                                </div>
                              </div>

                              {/* Theme Badge */}
                              <div className="mt-4">
                                <span className="badge badge-primary capitalize">
                                  {selectedThemeData?.name} Theme
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-center text-gray-500 px-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-14 w-14 mx-auto mb-3 opacity-40"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                                  />
                                </svg>
                                <p className="text-sm">
                                  Select a theme to see preview
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedTheme || !bundleName.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create & Continue"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateBundleModal;