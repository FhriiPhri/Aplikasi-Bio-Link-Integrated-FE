import { useState, useEffect } from "react";
import {
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  Link2,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import CreateBundleModal from "../../components/CreateBundleModal";
import ConfirmDangerModal from "../../components/ConfirmDangerModal";
import Layout from "../../components/layouts/Layout";
import {
  FaInstagram,
  FaGithub,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";

function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE}/user/bundles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bundles");

      const result = await response.json();
      setBundles(result.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching bundles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      if (!token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE}/user/bundles/${id}`, {
        method: "DELETE", // penting
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text(); // biar debug gampang
        throw new Error(`Failed to delete bundle: ${text}`);
      }

      fetchBundles(); // refresh daftar bundle
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSuccess = (bundleId) => {
    setShowCreateModal(false);
    window.location.href = `/bundles/${bundleId}/edit`;
  };

  const filteredBundles = bundles.filter(
    (bundle) =>
      bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-700 font-semibold text-lg">
              Loading your bundles...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-2xl shadow-xl border border-red-100 p-10 max-w-md mx-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={fetchBundles}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        .bundles-page {
          font-family: "Inter", sans-serif;
        }

        .bundle-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          border: 1px solid #e5e7eb;
        }

        .bundle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.15);
          border-color: #dbeafe;
        }

        .bundle-list-card {
          transition: all 0.2s ease;
          background: white;
          border: 1px solid #e5e7eb;
        }

        .bundle-list-card:hover {
          background: #fafbfc;
          border-color: #dbeafe;
          box-shadow: 0 4px 12px -4px rgba(59, 130, 246, 0.1);
        }

        .social-icon {
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          transform: scale(1.15);
        }

        .action-btn {
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .search-input:focus {
          box-shadow: none;
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }

        .view-toggle-btn {
          transition: all 0.2s ease;
        }

        .view-toggle-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>

      <div className="bundles-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 md:mb-10">
            <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Link2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                      My Bundles
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Manage and organize your link collections
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-xl">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm font-medium opacity-90">
                      Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {bundles.length}
                    </span>
                    <span className="text-xs sm:text-sm font-medium opacity-90">
                      {bundles.length !== 1 ? "Bundles" : "Bundle"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-sm sm:text-base"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  <span>Create Bundle</span>
                </button>
              </div>
            </div>

            {/* Search and View Toggle */}
            {bundles.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search bundles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all text-sm sm:text-base text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1.5 self-center sm:self-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`view-toggle-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${
                      viewMode === "grid"
                        ? "active"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutGrid size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xs:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`view-toggle-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${
                      viewMode === "list"
                        ? "active"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xs:inline">List</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {bundles.length === 0 ? (
            <div className="text-center py-16 sm:py-20 md:py-24 bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Link2 className="text-blue-600" size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  No bundles yet
                </h3>
                <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                  Create your first bundle to start organizing and sharing your
                  links with the world
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-base sm:text-lg"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  Create Your First Bundle
                </button>
              </div>
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Search className="text-gray-300 mx-auto mb-4" size={40} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No bundles found
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Try adjusting your search query
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredBundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className="bundle-card rounded-xl sm:rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight flex-1 pr-2">
                        {bundle.name}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs text-blue-700 bg-white px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold border border-blue-100 shadow-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      <span className="truncate">
                        {bundle.theme?.name || "Default Theme"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
                    {/* Social Platforms */}
                    {(bundle.instagram_url ||
                      bundle.github_url ||
                      bundle.tiktok_url ||
                      bundle.youtube_url ||
                      bundle.facebook_url ||
                      bundle.x_url) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                          Connected Platforms
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {bundle.instagram_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaInstagram
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                          {bundle.github_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-gray-900 rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaGithub
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                          {bundle.tiktok_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-black rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaTiktok
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                          {bundle.youtube_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-red-600 rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaYoutube
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                          {bundle.facebook_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-blue-600 rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaFacebook
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                          {bundle.x_url && (
                            <div className="social-icon p-2 sm:p-2.5 bg-gray-900 rounded-lg sm:rounded-xl text-white shadow-md">
                              <FaXTwitter
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Slug */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Public Link
                      </p>
                      <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 font-mono font-medium overflow-hidden">
                        <Link2
                          size={14}
                          className="text-blue-600 flex-shrink-0 sm:w-4 sm:h-4"
                        />
                        <span className="text-blue-600 truncate">
                          /{bundle.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                    <a
                      href={`/${bundle.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all font-semibold text-xs sm:text-sm shadow-sm"
                    >
                      <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">View</span>
                    </a>
                    <button
                      onClick={() =>
                        (window.location.href = `/bundles/${bundle.id}/edit`)
                      }
                      className="action-btn flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/30"
                    >
                      <Edit2 size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBundleId(bundle.id);
                        setDeleteModalOpen(true);
                      }}
                      className="action-btn px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-100 transition-all border-2 border-red-200 hover:border-red-300 shadow-sm"
                      title="Delete bundle"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredBundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className="bundle-list-card rounded-xl p-5 md:p-6 lg:p-7 animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-6">
                    {/* Bundle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 lg:gap-5">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                          <Link2 className="text-white" size={24} />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 truncate">
                            {bundle.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="inline-flex items-center gap-2 text-blue-600 font-mono font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                              <Link2 size={14} className="flex-shrink-0" />
                              <span className="truncate">/{bundle.slug}</span>
                            </span>
                            <span className="inline-flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200">
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              <span className="truncate">
                                {bundle.theme?.name || "Default"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Icons - Desktop */}
                    {(bundle.instagram_url ||
                      bundle.github_url ||
                      bundle.tiktok_url ||
                      bundle.youtube_url ||
                      bundle.facebook_url ||
                      bundle.x_url) && (
                      <div className="hidden lg:flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        {bundle.instagram_url && (
                          <div className="social-icon p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white shadow-md">
                            <FaInstagram size={18} />
                          </div>
                        )}
                        {bundle.github_url && (
                          <div className="social-icon p-2.5 bg-gray-900 rounded-lg text-white shadow-md">
                            <FaGithub size={18} />
                          </div>
                        )}
                        {bundle.tiktok_url && (
                          <div className="social-icon p-2.5 bg-black rounded-lg text-white shadow-md">
                            <FaTiktok size={18} />
                          </div>
                        )}
                        {bundle.youtube_url && (
                          <div className="social-icon p-2.5 bg-red-600 rounded-lg text-white shadow-md">
                            <FaYoutube size={18} />
                          </div>
                        )}
                        {bundle.facebook_url && (
                          <div className="social-icon p-2.5 bg-blue-600 rounded-lg text-white shadow-md">
                            <FaFacebook size={18} />
                          </div>
                        )}
                        {bundle.x_url && (
                          <div className="social-icon p-2.5 bg-gray-900 rounded-lg text-white shadow-md">
                            <FaXTwitter size={18} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions - Desktop */}
                    <div className="hidden lg:flex gap-3">
                      <a
                        href={`/${bundle.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all font-semibold text-sm shadow-sm"
                      >
                        <ExternalLink size={18} />
                        View
                      </a>
                      <button
                        onClick={() =>
                          (window.location.href = `/bundles/${bundle.id}/edit`)
                        }
                        className="action-btn flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-sm shadow-lg shadow-blue-500/30"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBundleId(bundle.id);
                          setDeleteModalOpen(true);
                        }}
                        className="action-btn px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border-2 border-red-200 shadow-sm"
                        title="Delete bundle"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Mobile Actions & Social */}
                    <div className="flex lg:hidden flex-col gap-3 pt-3 border-t border-gray-200">
                      {/* Social Icons - Mobile */}
                      {(bundle.instagram_url ||
                        bundle.github_url ||
                        bundle.tiktok_url ||
                        bundle.youtube_url ||
                        bundle.facebook_url ||
                        bundle.x_url) && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {bundle.instagram_url && (
                            <div className="social-icon p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                              <FaInstagram size={16} />
                            </div>
                          )}
                          {bundle.github_url && (
                            <div className="social-icon p-2 bg-gray-900 rounded-lg text-white">
                              <FaGithub size={16} />
                            </div>
                          )}
                          {bundle.tiktok_url && (
                            <div className="social-icon p-2 bg-black rounded-lg text-white">
                              <FaTiktok size={16} />
                            </div>
                          )}
                          {bundle.youtube_url && (
                            <div className="social-icon p-2 bg-red-600 rounded-lg text-white">
                              <FaYoutube size={16} />
                            </div>
                          )}
                          {bundle.facebook_url && (
                            <div className="social-icon p-2 bg-blue-600 rounded-lg text-white">
                              <FaFacebook size={16} />
                            </div>
                          )}
                          {bundle.x_url && (
                            <div className="social-icon p-2 bg-gray-900 rounded-lg text-white">
                              <FaXTwitter size={16} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions - Mobile */}
                      <div className="flex gap-2">
                        <a
                          href={`/${bundle.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all font-semibold text-sm"
                        >
                          <ExternalLink size={16} />
                          View
                        </a>
                        <button
                          onClick={() =>
                            (window.location.href = `/bundles/${bundle.id}/edit`)
                          }
                          className="action-btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-sm shadow-md shadow-blue-500/30"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBundleId(bundle.id);
                            setDeleteModalOpen(true);
                          }}
                          className="action-btn px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border-2 border-red-200"
                          title="Delete bundle"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Bundle Modal */}
          {showCreateModal && (
            <CreateBundleModal
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleCreateSuccess}
            />
          )}

          {/* Delete Confirm Modal */}
          <ConfirmDangerModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Delete Bundle?"
            subtitle="This action cannot be undone"
            warningItems={[
              "Bundle data and links",
              "Analytics and stats",
              "Public access to this bundle",
            ]}
            confirmText="Delete Bundle"
            onConfirm={() => handleDelete(selectedBundleId)}
          />
        </div>
      </div>
    </Layout>
  );
}

export default BundlesPage;