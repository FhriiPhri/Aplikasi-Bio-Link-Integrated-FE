import { useState, useEffect, useContext, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Clock,
  AlertCircle,
  ChevronDown,
  Filter,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Download,
  Shield,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/layouts/Layout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminAppealsPage() {
  const { user } = useContext(AuthContext);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [processingId, setProcessingId] = useState(null);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "approve" or "reject"
  const [adminReply, setAdminReply] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Refs for click outside
  const filterRef = useRef(null);
  const detailModalRef = useRef(null);
  const actionModalRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
      if (
        showDetailModal &&
        detailModalRef.current &&
        !detailModalRef.current.contains(event.target)
      ) {
        handleCloseDetailModal();
      }
      if (
        showActionModal &&
        actionModalRef.current &&
        !actionModalRef.current.contains(event.target)
      ) {
        handleCloseActionModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetailModal, showActionModal]);

  // Fetch appeals
  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/admin/appeals", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppeals(data.data || []);

        // Calculate stats
        const total = data.data?.length || 0;
        const pending =
          data.data?.filter((a) => a.status === "pending").length || 0;
        const approved =
          data.data?.filter((a) => a.status === "approved").length || 0;
        const rejected =
          data.data?.filter((a) => a.status === "rejected").length || 0;

        setStats({ total, pending, approved, rejected });
      }
    } catch (error) {
      console.error("Error fetching appeals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  // Filter and sort appeals
  const filteredAppeals = appeals
    .filter((appeal) => {
      const matchesSearch =
        appeal.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.appeal_reason?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appeal.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "pending":
          return (
            (a.status === "pending" ? -1 : 1) -
            (b.status === "pending" ? -1 : 1)
          );
        default:
          return 0;
      }
    });

  // Modal handlers
  const handleViewDetail = (appeal) => {
    setSelectedAppeal(appeal);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedAppeal(null);
    setShowDetailModal(false);
  };

  const handleOpenActionModal = (appeal, action) => {
    setSelectedAppeal(appeal);
    setModalAction(action);
    setAdminReply(
      action === "approve" ? "Banding diterima" : "Banding ditolak"
    );
    setShowActionModal(true);
  };

  const handleCloseActionModal = () => {
    setSelectedAppeal(null);
    setModalAction("");
    setAdminReply("");
    setShowActionModal(false);
  };

  // Process appeal action
  const handleProcessAppeal = async () => {
    if (!selectedAppeal || !adminReply.trim()) return;

    try {
      setProcessingId(selectedAppeal.id);
      const token = localStorage.getItem("token");
      const endpoint = modalAction === "approve" ? "approve" : "reject";

      const response = await fetch(
        `http://localhost:8000/api/admin/appeals/${selectedAppeal.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ admin_reply: adminReply }),
        }
      );

      if (response.ok) {
        await fetchAppeals();
        handleCloseActionModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || `Gagal memproses banding`);
      }
    } catch (error) {
      console.error("Error processing appeal:", error);
      alert("Terjadi kesalahan saat memproses banding");
    } finally {
      setProcessingId(null);
    }
  };

  // Format date
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

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-600",
        };
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-600",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: AlertCircle,
          iconColor: "text-gray-600",
        };
    }
  };

  // Export to Excel
  const handleExportData = () => {
    if (filteredAppeals.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const exportData = filteredAppeals.map((appeal, index) => ({
      No: index + 1,
      "Nama Pengguna": appeal.user?.name || "N/A",
      Email: appeal.user?.email || "N/A",
      "Alasan Banding": appeal.appeal_reason || "N/A",
      "Bukti Pendukung": appeal.appeal_evidence || "Tidak ada",
      Status:
        appeal.status === "pending"
          ? "Menunggu"
          : appeal.status === "approved"
          ? "Diterima"
          : "Ditolak",
      "Tanggal Pengajuan": formatDateShort(appeal.created_at),
      "Balasan Admin": appeal.admin_reply || "Belum ada balasan",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banding Pengguna");

    // Auto column width
    const maxWidth = exportData.reduce(
      (w, r) => Math.max(w, r["Alasan Banding"]?.length || 0),
      10
    );
    worksheet["!cols"] = [
      { wch: 5 }, // No
      { wch: 25 }, // Nama
      { wch: 30 }, // Email
      { wch: Math.min(maxWidth, 50) }, // Alasan
      { wch: 30 }, // Bukti
      { wch: 15 }, // Status
      { wch: 20 }, // Tanggal
      { wch: 30 }, // Balasan
    ];

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const today = new Date().toISOString().split("T")[0];
    saveAs(data, `Banding-Pengguna-${today}.xlsx`);
  };

  return (
    <Layout>
      {/* Action Modal */}
      {showActionModal && selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex items-center justify-center p-4 animate-fadeIn">
          <div
            ref={actionModalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`p-3 rounded-full ${
                    modalAction === "approve" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {modalAction === "approve" ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {modalAction === "approve"
                      ? "Setujui Banding"
                      : "Tolak Banding"}
                  </h3>
                  <p className="text-gray-600">
                    {modalAction === "approve"
                      ? `Setujui banding dari ${selectedAppeal.user?.name}?`
                      : `Tolak banding dari ${selectedAppeal.user?.name}?`}
                  </p>
                </div>
              </div>

              {/* Admin Reply Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Balasan Admin
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Tulis balasan untuk pengguna..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Balasan ini akan dikirim ke pengguna dan disimpan dalam
                  riwayat.
                </p>
              </div>

              {/* Warning Message */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {modalAction === "approve"
                      ? "Pengguna akan langsung diaktifkan kembali dan dapat login ke sistem."
                      : "Pengguna akan tetap dinonaktifkan dan tidak dapat login."}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleProcessAppeal}
                  disabled={
                    processingId === selectedAppeal.id || !adminReply.trim()
                  }
                  className={`flex-1 py-3 font-medium rounded-xl transition-all duration-300 hover:shadow-lg ${
                    modalAction === "approve"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processingId === selectedAppeal.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memproses...
                    </span>
                  ) : modalAction === "approve" ? (
                    "Ya, Setujui"
                  ) : (
                    "Ya, Tolak"
                  )}
                </button>
                <button
                  onClick={handleCloseActionModal}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[150] flex items-center justify-center p-4 animate-fadeIn">
          <div
            ref={detailModalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Detail Banding
                    </h3>
                    <p className="text-gray-500">
                      Informasi lengkap pengajuan banding
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 hover:scale-110"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Info */}
              <div className="flex items-start gap-6 mb-8 p-4 bg-gradient-to-r from-indigo-50 to-white rounded-xl">
                <img
                  src={
                    selectedAppeal.user?.avatar
                      ? `http://localhost:8000/storage/${selectedAppeal.user.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedAppeal.user?.name || "User"
                        )}&background=6366f1&color=fff&bold=true`
                  }
                  alt={selectedAppeal.user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedAppeal.user?.name}
                    </h4>
                    <div className="flex gap-2">
                      {selectedAppeal.user?.role === "admin" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                          Administrator
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          Pengguna
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                          selectedAppeal.status === "approved"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : selectedAppeal.status === "rejected"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {getStatusColor(selectedAppeal.status).icon && (
                          <selectedAppeal.status.icon className="w-3 h-3" />
                        )}
                        {selectedAppeal.status === "pending"
                          ? "Menunggu"
                          : selectedAppeal.status === "approved"
                          ? "Diterima"
                          : "Ditolak"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedAppeal.user?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Bergabung:{" "}
                      {formatDateShort(selectedAppeal.user?.created_at)}
                    </p>
                    {selectedAppeal.user?.ban_message && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                        <p className="text-sm font-medium text-red-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Alasan Penonaktifan:{" "}
                            {selectedAppeal.user.ban_message}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Appeal Content */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Alasan Banding
                  </h5>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedAppeal.appeal_reason || "Tidak ada alasan"}
                    </p>
                  </div>
                </div>

                {selectedAppeal.appeal_evidence && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">
                      Bukti Pendukung
                    </h5>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedAppeal.appeal_evidence}
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Reply (if exists) */}
                {selectedAppeal.admin_reply && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      Balasan Admin
                    </h5>
                    <div
                      className={`p-4 rounded-xl border ${
                        selectedAppeal.status === "approved"
                          ? "bg-green-50 border-green-200"
                          : selectedAppeal.status === "rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedAppeal.admin_reply}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Dibalas pada: {formatDate(selectedAppeal.updated_at)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Diajukan pada:
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(selectedAppeal.created_at)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getRelativeTime(selectedAppeal.created_at)}
                    </p>
                  </div>

                  {selectedAppeal.updated_at !== selectedAppeal.created_at && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Diproses pada:
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(selectedAppeal.updated_at)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {getRelativeTime(selectedAppeal.updated_at)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons (if pending) */}
                {selectedAppeal.status === "pending" && (
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleOpenActionModal(selectedAppeal, "approve")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Setujui Banding
                    </button>
                    <button
                      onClick={() =>
                        handleOpenActionModal(selectedAppeal, "reject")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak Banding
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Manajemen Banding
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Kelola pengajuan banding dari pengguna yang dinonaktifkan
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchAppeals}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
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
          {[
            {
              icon: MessageSquare,
              color: "blue",
              value: stats.total,
              label: "Total Banding",
              description: "Semua pengajuan",
            },
            {
              icon: Clock,
              color: "yellow",
              value: stats.pending,
              label: "Menunggu",
              description: "Perlu diproses",
            },
            {
              icon: CheckCircle,
              color: "green",
              value: stats.approved,
              label: "Disetujui",
              description: "Banding diterima",
            },
            {
              icon: XCircle,
              color: "red",
              value: stats.rejected,
              label: "Ditolak",
              description: "Banding ditolak",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 bg-${stat.color}-50 rounded-xl border border-${stat.color}-100`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Appeals Table Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header with Controls */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Daftar Banding
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredAppeals.length} dari {appeals.length} banding
                  ditemukan
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari banding..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-2.5 w-full sm:w-64 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter Menu */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showFilterMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-indigo-200 rounded-xl shadow-xl z-10 animate-slideDown">
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">
                            Status Banding
                          </p>
                          <div className="space-y-2">
                            {[
                              {
                                value: "all",
                                label: "Semua Status",
                                color: "gray",
                              },
                              {
                                value: "pending",
                                label: "Menunggu",
                                color: "yellow",
                              },
                              {
                                value: "approved",
                                label: "Disetujui",
                                color: "green",
                              },
                              {
                                value: "rejected",
                                label: "Ditolak",
                                color: "red",
                              },
                            ].map((status) => (
                              <label
                                key={status.value}
                                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="status"
                                  checked={statusFilter === status.value}
                                  onChange={() => {
                                    setStatusFilter(status.value);
                                    setShowFilterMenu(false);
                                  }}
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-${status.color}-500`}
                                  ></div>
                                  <span className="text-sm text-gray-700">
                                    {status.label}
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer w-full"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="pending">Prioritas Menunggu</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-600">Memuat data banding...</p>
              </div>
            ) : filteredAppeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak ada banding ditemukan
                </h3>
                <p className="text-gray-600 max-w-sm">
                  {searchTerm || statusFilter !== "all"
                    ? "Coba ubah filter pencarian untuk menemukan banding yang Anda cari."
                    : "Belum ada pengajuan banding dari pengguna."}
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
                      Alasan Banding
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppeals.map((appeal) => {
                    const status = getStatusColor(appeal.status);
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={appeal.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                appeal.user?.avatar
                                  ? `http://localhost:8000/storage/${appeal.user.avatar}`
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      appeal.user?.name || "User"
                                    )}&background=6366f1&color=fff&bold=true`
                              }
                              alt={appeal.user?.name}
                              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {appeal.user?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {appeal.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {appeal.appeal_reason || "Tidak ada alasan"}
                          </p>
                          {appeal.appeal_evidence && (
                            <p className="text-xs text-gray-500 mt-1">
                              Ada bukti pendukung
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                              {formatDateShort(appeal.created_at)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getRelativeTime(appeal.created_at)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon
                              className={`w-4 h-4 ${status.iconColor}`}
                            />
                            <span
                              className={`text-sm font-medium ${status.text}`}
                            >
                              {appeal.status === "pending"
                                ? "Menunggu"
                                : appeal.status === "approved"
                                ? "Diterima"
                                : "Ditolak"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetail(appeal)}
                              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              title="Lihat Detail"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {appeal.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleOpenActionModal(appeal, "approve")
                                  }
                                  disabled={processingId === appeal.id}
                                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() =>
                                    handleOpenActionModal(appeal, "reject")
                                  }
                                  disabled={processingId === appeal.id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Menampilkan{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredAppeals.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-900">
                  {appeals.length}
                </span>{" "}
                banding
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Klik ikon mata untuk melihat detail banding</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </Layout>
  );
}