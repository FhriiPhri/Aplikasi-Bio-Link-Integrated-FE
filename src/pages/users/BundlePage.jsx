import { useState, useEffect } from "react";
import { Plus, ExternalLink, Trash2, Edit, Link2 } from "lucide-react";
import CreateBundleModal from "../../components/CreateBundleModal";
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

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/user/bundles", {
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
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/user/bundles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete bundle");

      fetchBundles();
    } catch (err) {
      alert("Failed to delete bundle: " + err.message);
    }
  };

  const handleCreateSuccess = (bundleId) => {
    setShowCreateModal(false);
    window.location.href = `/bundles/${bundleId}/edit`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading bundles...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center bg-white rounded-xl shadow-sm border border-red-100 p-8 max-w-md">
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
              Error Loading Bundles
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchBundles}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        .bundles-page {
          font-family: "Inter", sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .bundle-card {
          transition: all 0.2s ease;
          background: white;
        }

        .bundle-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
        }

        .social-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .action-button {
          transition: all 0.15s ease;
        }

        .action-button:hover {
          transform: scale(1.02);
        }

        .action-button:active {
          transform: scale(0.98);
        }

        .stats-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>

      <div className="bundles-page">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                My Bundles
              </h1>
              <p className="text-gray-600">
                Manage and organize your link collections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="stats-badge text-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-semibold">
                  {bundles.length} Bundle{bundles.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                <Plus size={20} />
                Create Bundle
              </button>
            </div>
          </div>

          {/* Empty State */}
          {bundles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Link2 className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bundles yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first bundle to start organizing and sharing your
                  links
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <Plus size={20} />
                  Create Your First Bundle
                </button>
              </div>
            </div>
          ) : (
            /* Bundles Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bundle-card rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {bundle.name}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {bundle.theme?.name || "Default Theme"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Social Platforms */}
                    {(bundle.instagram_url ||
                      bundle.github_url ||
                      bundle.tiktok_url ||
                      bundle.youtube_url ||
                      bundle.facebook_url ||
                      bundle.x_url) && (
                      <div className="flex gap-2 flex-wrap">
                        {bundle.instagram_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md">
                            <FaInstagram size={14} />
                            Instagram
                          </span>
                        )}

                        {bundle.github_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 text-white rounded-md">
                            <FaGithub size={14} />
                            GitHub
                          </span>
                        )}

                        {bundle.tiktok_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-black text-white rounded-md">
                            <FaTiktok size={14} />
                            TikTok
                          </span>
                        )}

                        {bundle.youtube_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white rounded-md">
                            <FaYoutube size={14} />
                            YouTube
                          </span>
                        )}

                        {bundle.facebook_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-md">
                            <FaFacebook size={14} />
                            Facebook
                          </span>
                        )}

                        {bundle.x_url && (
                          <span className="social-badge flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 text-white rounded-md">
                            <FaXTwitter size={14} />X
                          </span>
                        )}
                      </div>
                    )}

                    {/* Slug */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-mono">
                      <Link2 size={14} className="text-gray-400" />
                      <span>/{bundle.slug}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                    <a
                      href={`/${bundle.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                      <ExternalLink size={16} />
                      View
                    </a>
                    <button
                      onClick={() =>
                        (window.location.href = `/bundles/${bundle.id}/edit`)
                      }
                      className="action-button flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bundle.id)}
                      className="action-button px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                      title="Delete bundle"
                    >
                      <Trash2 size={16} />
                    </button>
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
        </div>
      </div>
    </Layout>
  );
}

export default BundlesPage;