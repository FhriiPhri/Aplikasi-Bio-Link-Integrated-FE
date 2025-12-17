import { useState, useEffect, useContext, useMemo } from "react";
import {
  Shield,
  Users,
  Ban,
  CheckCircle,
  Search,
  RefreshCw,
  Eye,
  X,
  Phone,
  Mail,
  User,
  Hash,
  Calendar,
  Clock,
  MoreVertical,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Activity,
  UserCheck,
  UserX,
  Download,
  BarChart3,
  Key,
  Smartphone,
  Globe,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/layouts/Layout";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingUserId, setProcessingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Stats data
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const bannedUsers = users.filter((u) => !u.is_active).length;
    const adminUsers = users.filter((u) => u.role === "admin").length;

    // Calculate growth (simulated)
    const growthRate = ((activeUsers - bannedUsers) / totalUsers) * 100;

    return {
      totalUsers,
      activeUsers,
      bannedUsers,
      adminUsers,
      growthRate: growthRate.toFixed(1),
      userActivity: Math.round((activeUsers / totalUsers) * 100) || 0,
    };
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.is_active) ||
        (statusFilter === "banned" && !u.is_active);

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "name":
          return a.name?.localeCompare(b.name);
        case "active":
          return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [users, searchTerm, statusFilter, roleFilter, sortBy]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Show user detail
  const handleViewDetail = (userData) => {
    setSelectedUser(userData);
    setShowDetailModal(true);
  };

  // Ban user (deactivate)
  const handleBanUser = async (userId) => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan user ini?")) {
      return;
    }

    try {
      setProcessingUserId(userId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/deactivate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
        alert("User berhasil dinonaktifkan");
      } else {
        alert("Gagal menonaktifkan user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Terjadi kesalahan saat menonaktifkan user");
    } finally {
      setProcessingUserId(null);
    }
  };

  // Activate user (unban)
  const handleActivateUser = async (userId) => {
    if (!confirm("Apakah Anda yakin ingin mengaktifkan user ini?")) {
      return;
    }

    try {
      setProcessingUserId(userId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
        alert("User berhasil diaktifkan");
      } else {
        alert("Gagal mengaktifkan user");
      }
    } catch (error) {
      console.error("Error activating user:", error);
      alert("Terjadi kesalahan saat mengaktifkan user");
    } finally {
      setProcessingUserId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes}m yang lalu`;
    if (hours < 24) return `${hours}j yang lalu`;
    if (days < 7) return `${days}h yang lalu`;
    return formatDateShort(dateString);
  };

  // Export data (simulated)
  const handleExportData = () => {
    alert("Fitur ekspor data akan segera hadir!");
  };

  return (
    <Layout>
      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Detail Pengguna
                    </h3>
                    <p className="text-gray-500">Informasi lengkap pengguna</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Profile Header */}
              <div className="flex items-start gap-6 mb-8 p-4 bg-gradient-to-r from-indigo-50 to-white rounded-xl">
                <img
                  src={
                    selectedUser.avatar
                      ? `http://localhost:8000/storage/${selectedUser.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedUser.name || "User"
                        )}&background=6366f1&color=fff&bold=true`
                  }
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {selectedUser.name}
                    </h4>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedUser.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {selectedUser.role === "admin"
                          ? "Administrator"
                          : "User"}
                      </span>
                      {selectedUser.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          <Ban className="w-3 h-3" />
                          Dinonaktifkan
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">@</span>
                      {selectedUser.username}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedUser.email}
                    </span>
                  </div>

                  {/* Bio */}
                  {selectedUser.bio && (
                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                      <p className="text-gray-700">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500">
                      Bergabung
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatDateShort(selectedUser.created_at)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500">
                      Aktif Terakhir
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {getRelativeTime(selectedUser.last_active)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500">Status</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      selectedUser.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedUser.is_active ? "Online" : "Offline"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500">User ID</p>
                  </div>
                  <p className="font-mono text-xs text-gray-900">
                    {selectedUser.id}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Kontak
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nomor Telepon</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.phone_number || "Tidak diatur"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <Globe className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lokasi</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.location || "Tidak diatur"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                {selectedUser.role !== "admin" && (
                  <>
                    {selectedUser.is_active ? (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleBanUser(selectedUser.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        <Ban className="w-4 h-4" />
                        Nonaktifkan Pengguna
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleActivateUser(selectedUser.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aktifkan Pengguna
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Admin
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Selamat datang kembali,{" "}
                    <span className="font-semibold text-indigo-600">
                      {user?.name}
                    </span>{" "}
                    👋
                  </p>
                </div>
              </div>
              <p className="text-gray-500 max-w-2xl">
                Kelola semua pengguna sistem, pantau aktivitas, dan jaga
                keamanan platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </button>
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Ekspor Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              {stats.growthRate > 0 ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <TrendingUp className="w-3 h-3" />+{stats.growthRate}%
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  <TrendingDown className="w-3 h-3" />
                  {stats.growthRate}%
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalUsers}
            </h3>
            <p className="text-gray-600 text-sm">Total Pengguna</p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600">
                {stats.userActivity}% aktif
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.activeUsers}
            </h3>
            <p className="text-gray-600 text-sm">Pengguna Aktif</p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-red-600">
                {stats.bannedUsers > 0 ? "Perlu perhatian" : "Aman"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.bannedUsers}
            </h3>
            <p className="text-gray-600 text-sm">Pengguna Dinonaktifkan</p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600">
                Administrator
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.adminUsers}
            </h3>
            <p className="text-gray-600 text-sm">Admin Sistem</p>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header with Controls */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Manajemen Pengguna
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredUsers.length} dari {users.length} pengguna ditemukan
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-2.5 w-full sm:w-64 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Status
                        </p>
                        <div className="space-y-2 text-black mb-4">
                          {["all", "active", "banned"].map((status) => (
                            <label
                              key={status}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="status"
                                checked={statusFilter === status}
                                onChange={() => setStatusFilter(status)}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm capitalize">
                                {status === "all" ? "Semua Status" : status}
                              </span>
                            </label>
                          ))}
                        </div>

                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Peran
                        </p>
                        <div className="space-y-2 text-black">
                          {["all", "admin", "user"].map((role) => (
                            <label
                              key={role}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="role"
                                checked={roleFilter === role}
                                onChange={() => setRoleFilter(role)}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm capitalize">
                                {role === "all" ? "Semua Peran" : role}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="name">Nama A-Z</option>
                  <option value="active">Status Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-600">Memuat data pengguna...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak ada pengguna ditemukan
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Coba ubah filter pencarian atau kata kunci untuk menemukan
                  pengguna yang Anda cari.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Informasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bergabung
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.avatar
                                ? `http://localhost:8000/storage/${u.avatar}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    u.name || "User"
                                  )}&background=6366f1&color=fff&bold=true`
                            }
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {u.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{u.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {u.role === "admin" ? "Admin" : "Pengguna"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            {formatDateShort(u.created_at)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(u.last_active)}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              u.is_active ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`text-sm font-medium ${
                              u.is_active ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {u.is_active ? "Aktif" : "Dinonaktifkan"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(u)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {u.role !== "admin" && (
                            <>
                              {u.is_active ? (
                                <button
                                  onClick={() => handleBanUser(u.id)}
                                  disabled={processingUserId === u.id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingUserId === u.id
                                    ? "Memproses..."
                                    : "Nonaktifkan"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateUser(u.id)}
                                  disabled={processingUserId === u.id}
                                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingUserId === u.id
                                    ? "Memproses..."
                                    : "Aktifkan"}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Menampilkan{" "}
                <span className="font-semibold">{filteredUsers.length}</span>{" "}
                dari <span className="font-semibold">{users.length}</span>{" "}
                pengguna
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Klik ikon mata untuk melihat detail pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
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
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
}