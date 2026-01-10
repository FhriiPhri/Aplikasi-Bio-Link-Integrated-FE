import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Users, Filter, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../components/layouts/Layout";

const AdminBundlesPage = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch bundles
  const fetchBundles = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Ganti dari 'admin_token' ke 'token'
      let url = `http://localhost:8000/api/admin/bundles?page=${page}`;
      
      if (selectedUserId) {
        url = `http://localhost:8000/api/admin/users/${selectedUserId}/bundles`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (selectedUserId) {
        setBundles(data.bundles || []);
        setPagination(null);
      } else {
        setBundles(data.data?.data || []);
        setPagination({
          current_page: data.data?.current_page,
          last_page: data.data?.last_page,
          total: data.data?.total,
          per_page: data.data?.per_page,
        });
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for filter
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Ganti dari 'admin_token' ke 'token'
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

  // View bundle detail - navigate to preview page
  const viewBundleDetail = (bundleId) => {
    navigate(`/admin/bundles/${bundleId}`);
  };

  // Delete bundle
  const deleteBundle = async (bundleId) => {
    if (!confirm('Yakin mau hapus bundle ini? Aksi ini tidak bisa dibatalkan!')) return;

    try {
      const token = localStorage.getItem('token'); // Ganti dari 'admin_token' ke 'token'
      const response = await fetch(`http://localhost:8000/api/admin/bundles/${bundleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Bundle berhasil dihapus!');
        fetchBundles(currentPage);
      }
    } catch (error) {
      console.error('Error deleting bundle:', error);
      alert('Gagal menghapus bundle!');
    }
  };

  useEffect(() => {
    fetchBundles(currentPage);
    fetchUsers();
  }, [currentPage, selectedUserId]);

  // Filter bundles by search query
  const filteredBundles = bundles.filter(bundle => 
    bundle.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                📦
              </div>
              Admin Bundle Manager
            </h1>
            <p className="text-gray-600">Kelola semua bundles dari semua user</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bundles by title, slug, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              {/* Filter by User */}
              <div className="md:w-64 relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.bundles_count || 0} bundles)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filter */}
              {(searchQuery || selectedUserId) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedUserId('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  Total: <span className="text-gray-900 font-semibold">{pagination?.total || bundles.length}</span> bundles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">
                  {selectedUserId ? '1 user selected' : `${users.length} users`}
                </span>
              </div>
            </div>
          </div>

          {/* Bundles List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bundles...</p>
              </div>
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    {/* Bundle Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Profile Image */}
                        {bundle.profile_image_url ? (
                          <img
                            src={bundle.profile_image_url}
                            alt={bundle.title}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-purple-300 transition-all"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                            {bundle.title?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                            {bundle.title}
                          </h3>

                          {/* Slug */}
                          <p className="text-sm text-gray-500 mb-3 font-mono">
                            /{bundle.slug}
                          </p>

                          {/* User Info */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-700">{bundle.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 text-sm">{bundle.user?.email}</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <LinkIcon className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-700 text-sm">
                                {bundle.links_count} links
                              </span>
                            </div>
                            
                            {bundle.theme && (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <span className="text-gray-700 text-sm">
                                  {bundle.theme.name}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
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
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* Preview Button */}
                      <button
                        onClick={() => viewBundleDetail(bundle.id)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 group/btn"
                        title="Preview Bundle"
                      >
                        <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* View Live */}
                      <a

                        href={`http://localhost:3000/${bundle.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all border border-green-200 group/btn"
                        title="View Live"
                      >
                        <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </a>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteBundle(bundle.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 group/btn"
                        title="Delete Bundle"
                      >
                        <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
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
                      className={`w-10 h-10 rounded-xl transition-all ${
                        currentPage === pageNum
                          ? 'bg-purple-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
                className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200"
              >
                Next
              </button>

              <div className="ml-4 text-gray-600 text-sm">
                Page {currentPage} of {pagination.last_page}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminBundlesPage;