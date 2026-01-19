import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Users, ExternalLink, Package, TrendingUp, BarChart3, Grid3x3, List, Link2, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../components/layouts/Layout";

const AdminBundlesPage = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [deleteModal, setDeleteModal] = useState({ show: false, bundle: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [deleting, setDeleting] = useState(false);

  // Show toast notification
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Fetch bundles
  const fetchBundles = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8000/api/admin/bundles?page=${page}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      setBundles(data.data?.data || []);
      setPagination({
        current_page: data.data?.current_page,
        last_page: data.data?.last_page,
        total: data.data?.total,
        per_page: data.data?.per_page,
      });
    } catch (error) {
      console.error('Error fetching bundles:', error);
      showNotification('Failed to fetch bundles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for stats
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // View bundle detail
  const viewBundleDetail = (bundleId) => {
    navigate(`/admin/bundles/${bundleId}`);
  };

  // Open delete modal
  const openDeleteModal = (bundle) => {
    setDeleteModal({ show: true, bundle });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({ show: false, bundle: null });
  };

  // Delete bundle
  const confirmDelete = async () => {
    const bundleId = deleteModal.bundle?.id;
    if (!bundleId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/bundles/${bundleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        closeDeleteModal();
        showNotification('Bundle deleted successfully!', 'success');
        await fetchBundles(currentPage);
      } else {
        showNotification('Failed to delete bundle', 'error');
      }
    } catch (error) {
      console.error('Error deleting bundle:', error);
      showNotification('Error: ' + error.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchBundles(currentPage);
    fetchUsers();
  }, [currentPage]);

  // Filter bundles
  const filteredBundles = bundles.filter(bundle => 
    bundle.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalLinks = bundles.reduce((sum, b) => sum + (b.links_count || 0), 0);
  const avgLinksPerBundle = bundles.length > 0 ? (totalLinks / bundles.length).toFixed(1) : 0;

  return (
    <Layout>
      <style jsx>{`
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Bundle Management</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor dan kelola semua user bundles</p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition-all ${
                    viewMode === 'table'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{pagination?.total || bundles.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Bundles</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Active Users</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalLinks}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Links</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{avgLinksPerBundle}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg Links/Bundle</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 mb-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by title, slug, or user name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 font-medium text-sm sm:text-base"
                >
                  Clear
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <span className="text-xs sm:text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredBundles.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{bundles.length}</span> bundles
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading bundles...</p>
              </div>
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid gap-3 sm:gap-4">
              {filteredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-3 sm:gap-4 w-full">
                      {bundle.profile_image_url ? (
                        <img
                          src={bundle.profile_image_url}
                          alt={bundle.title}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-all shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-md flex-shrink-0">
                          {bundle.title?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                          {bundle.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-mono bg-gray-50 px-2 py-1 rounded inline-block truncate max-w-full">
                          /{bundle.slug}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="text-sm font-medium text-gray-900 truncate">{bundle.user?.name}</div>
                            <span className="text-gray-400 hidden sm:inline">•</span>
                            <div className="text-xs text-gray-500 truncate">{bundle.user?.email}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <span className="text-blue-600 font-medium">{bundle.links_count} links</span>
                          
                          {bundle.theme && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-blue-600 font-medium truncate">{bundle.theme.name}</span>
                            </>
                          )}

                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(bundle.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => viewBundleDetail(bundle.id)}
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 group/btn hover:shadow-md"
                        title="Preview Bundle"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform mx-auto" />
                      </button>

                      <a
                        href={`http://localhost:3000/${bundle.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all border border-green-200 group/btn hover:shadow-md flex items-center justify-center"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
                      </a>

                      <button
                        onClick={() => openDeleteModal(bundle)}
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 group/btn hover:shadow-md"
                        title="Delete Bundle"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bundle</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Links</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Theme</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBundles.map((bundle) => (
                      <tr key={bundle.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {bundle.profile_image_url ? (
                              <img
                                src={bundle.profile_image_url}
                                alt={bundle.title}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                                {bundle.title?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 text-sm truncate">{bundle.title}</div>
                              <div className="text-xs text-gray-500 font-mono truncate">/{bundle.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{bundle.user?.name}</div>
                            <div className="text-xs text-gray-500 truncate">{bundle.user?.email}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="text-sm font-semibold text-blue-600">{bundle.links_count}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          {bundle.theme ? (
                            <span className="text-sm text-blue-600 font-medium truncate block">{bundle.theme.name}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {new Date(bundle.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <button
                              onClick={() => viewBundleDetail(bundle.id)}
                              className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <a
                              href={`http://localhost:3000/${bundle.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 sm:p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                              title="View Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                            <button
                              onClick={() => openDeleteModal(bundle)}
                              className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-200 gap-4">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * pagination.per_page) + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">{Math.min(currentPage * pagination.per_page, pagination.total)}</span> of{' '}
                <span className="font-semibold text-gray-900">{pagination.total}</span> results
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let pageNum;
                    if (pagination.last_page <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.last_page - 2) {
                      pageNum = pagination.last_page - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium transition-all text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                  disabled={currentPage === pagination.last_page}
                  className="px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 font-medium text-xs sm:text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Delete Bundle?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Yakin mau hapus bundle "<span className="font-semibold text-gray-900 break-words">{deleteModal.bundle?.title}</span>"? Aksi ini tidak bisa dibatalkan!
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-red-800">
                  <p className="font-semibold mb-1">Warning:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>Semua links akan terhapus</li>
                    <li>Data tidak dapat dikembalikan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Deleting...</span>
                    <span className="sm:hidden">Deleting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Delete Bundle</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminBundlesPage;