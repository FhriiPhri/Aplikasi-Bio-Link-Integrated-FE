import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import {
  ArrowLeft,
  ExternalLink,
  User,
  Mail,
  Calendar,
  Link as LinkIcon,
  Palette,
  Trash2,
  Package,
} from "lucide-react";

const BundlePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBundleDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE}/admin/bundles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Bundle data:", data.data);
      setBundle(data.data);
    } catch (error) {
      console.error("Error fetching bundle detail:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBundle = async () => {
    if (!confirm("Yakin mau hapus bundle ini? Aksi ini tidak bisa dibatalkan!"))
      return;

    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE}/admin/bundles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Bundle berhasil dihapus!");
        navigate("/admin/bundles");
      }
    } catch (error) {
      console.error("Error deleting bundle:", error);
      alert("Gagal menghapus bundle!");
    }
  };

  useEffect(() => {
    fetchBundleDetail();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bundle preview...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !bundle) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bundle not found
            </h2>
            {error && (
              <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                Error: {error}
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Bundle dengan ID{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{id}</code> tidak
              ditemukan.
            </p>
            <button
              onClick={() => navigate("/admin/bundles")}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
            >
              Back to Bundles
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get theme name for DaisyUI
  const themeName = bundle.theme?.name || "light";

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/admin/bundles")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3">
                  {bundle.profile_image_url ? (
                    <img
                      src={bundle.profile_image_url}
                      alt={bundle.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                      {bundle.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {bundle.name}
                    </h1>
                    <p className="text-gray-500 text-sm font-mono">
                      /{bundle.slug}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/${bundle.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden md:inline">View as User</span>
                </a>

                <button
                  onClick={deleteBundle}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Bundle Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Owner Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Bundle Owner
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {bundle.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {bundle.user?.name}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {bundle.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              {bundle.theme && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-200"></div>
                    <div>
                      <p className="text-gray-900 font-medium capitalize">
                        {bundle.theme.name}
                      </p>
                      <p className="text-gray-500 text-xs">DaisyUI Theme</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created At
                </h3>
                <p className="text-gray-900 text-lg font-semibold">
                  {new Date(bundle.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bundle Statistics
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center bg-purple-50 rounded-xl p-4">
                    <div className="text-4xl font-bold text-purple-600">
                      {bundle.links_count || bundle.links?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Links
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mobile Preview */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-[375px] h-[667px] bg-black rounded-[3rem] shadow-2xl p-3">
                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-50"></div>

                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-br from-gray-900 to-gray-800 z-40 flex items-center justify-between px-6 pt-2">
                        <span className="text-xs font-semibold text-white">
                          9:41
                        </span>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                      </div>

                      {/* Content Area with DaisyUI Theme */}
                      <div
                        data-theme={themeName}
                        className="absolute top-12 left-0 right-0 bottom-0 overflow-y-auto bg-base-100"
                      >
                        <div className="flex flex-col items-center justify-center min-h-full p-6 py-12">
                          {/* Profile Image */}
                          <div className="mb-6">
                            {bundle.profile_image_url ? (
                              <img
                                src={bundle.profile_image_url}
                                alt={bundle.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-base-200 shadow-lg"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center text-4xl font-bold text-base-content shadow-lg">
                                {bundle.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <h2 className="text-2xl font-bold mb-2 text-center text-base-content">
                            {bundle.name}
                          </h2>

                          {/* Description */}
                          {bundle.description && (
                            <p className="text-center text-sm mb-6 max-w-xs text-base-content opacity-80">
                              {bundle.description}
                            </p>
                          )}

                          {/* Social Media Icons */}
                          <div className="flex gap-3 mb-6 flex-wrap justify-center">
                            {bundle.instagram_url && (
                              <a
                                href={bundle.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </a>
                            )}
                            {bundle.github_url && (
                              <a
                                href={bundle.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-gray-800 hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                              </a>
                            )}
                            {bundle.tiktok_url && (
                              <a
                                href={bundle.tiktok_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-black hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                              </a>
                            )}
                            {bundle.youtube_url && (
                              <a
                                href={bundle.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-red-600 hover:bg-red-700 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                              </a>
                            )}
                            {bundle.facebook_url && (
                              <a
                                href={bundle.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-blue-600 hover:bg-blue-700 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                              </a>
                            )}
                            {bundle.x_url && (
                              <a
                                href={bundle.x_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-circle btn-sm bg-black hover:bg-gray-900 border-0 text-white"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </a>
                            )}
                          </div>

                          {/* Links */}
                          <div className="w-full max-w-sm space-y-3">
                            {bundle.links && bundle.links.length > 0 ? (
                              bundle.links.map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary w-full shadow-lg hover:shadow-xl transition-all normal-case text-sm font-medium"
                                >
                                  {link.name}
                                </a>
                              ))
                            ) : (
                              <div className="text-center py-12 text-base-content opacity-50">
                                <LinkIcon className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-sm">No links available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone Buttons */}
                    <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-800 rounded-l"></div>
                    <div className="absolute -right-1 top-40 w-1 h-16 bg-gray-800 rounded-l"></div>
                    <div className="absolute -right-1 top-60 w-1 h-16 bg-gray-800 rounded-l"></div>
                    <div className="absolute -left-1 top-32 w-1 h-8 bg-gray-800 rounded-r"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <a
                      href={`${process.env.REACT_APP_BASE_URL}/${bundle.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 flex items-center gap-2 font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open Live
                    </a>

                    <button
                      onClick={deleteBundle}
                      className="px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 flex items-center gap-2 font-medium"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Bundle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BundlePreviewPage;