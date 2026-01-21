import { useState, useEffect, useContext, useMemo, useRef } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/layouts/Layout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import ExcelLogo from "../../assets/ExcelLogo.png";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    type: "",
    userId: null,
    userName: "",
  });

  // Refs untuk handle click outside
  const filterRef = useRef(null);
  const detailModalRef = useRef(null);
  const confirmModalRef = useRef(null);
  const today = new Date();
  const autoFitColumns = (worksheet) => {
    worksheet.columns.forEach((column) => {
      let maxLength = 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        let cellValue = cell.value;

        if (cellValue === null || cellValue === undefined) return;

        // Kalau object (date, rich text, etc)
        if (typeof cellValue === "object") {
          cellValue = cellValue.text || cellValue.toString();
        }

        maxLength = Math.max(maxLength, cellValue.toString().length);
      });

      // Kasih padding biar lega
      column.width = maxLength + 4;
    });
  };
  const [banMessage, setBanMessage] = useState("");

  // Handle click outside untuk semua modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close filter menu jika klik di luar
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }

      // Close detail modal jika klik di luar
      if (
        showDetailModal &&
        detailModalRef.current &&
        !detailModalRef.current.contains(event.target)
      ) {
        handleCloseDetailModal();
      }

      // Close confirm modal jika klik di luar
      if (
        showConfirmModal &&
        confirmModalRef.current &&
        !confirmModalRef.current.contains(event.target)
      ) {
        handleCloseConfirmModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetailModal, showConfirmModal]);

  const handleCloseDetailModal = () => {
    setSelectedUser(null);
    setShowDetailModal(false);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction({ type: "", userId: null, userName: "" });
    setBanMessage(""); // Reset ban message
  };

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

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE}/admin/users`, {
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

  // Show confirm modal untuk ban/activate
  const showConfirmActionModal = (type, userId, userName) => {
    setConfirmAction({ type, userId, userName });
    setShowConfirmModal(true);
    if (type !== "ban") {
      setBanMessage(""); // Clear ban message if not ban action
    }
  };

  // Ban user (deactivate)
  const handleBanUser = async (userId) => {
    try {
      setProcessingUserId(userId);
      const token = localStorage.getItem("token");

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(
        `${API_BASE}/admin/users/${userId}/deactivate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ban_message: banMessage,
          }),
        },
      );

      if (response.ok) {
        await fetchUsers();
        handleCloseConfirmModal();
        setBanMessage(""); // Reset message
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Gagal menonaktifkan user");
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
    try {
      setProcessingUserId(userId);
      const token = localStorage.getItem("token");

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(
        `${API_BASE}/admin/users/${userId}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        await fetchUsers();
        handleCloseConfirmModal();
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

  // Execute action setelah konfirmasi
  const executeAction = () => {
    if (confirmAction.type === "ban") {
      handleBanUser(confirmAction.userId);
    } else if (confirmAction.type === "activate") {
      handleActivateUser(confirmAction.userId);
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

  // Export data to Excel
  const handleExportData = async () => {
    if (filteredUsers.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    try {
      // 1️⃣ Buat workbook & sheet
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Data Pengguna");

      // Metadata
      sheet.properties.defaultRowHeight = 24;

      // 2️⃣ Definisikan kolom
      sheet.columns = [
        { header: "No", key: "no", width: 8 },
        { header: "Nama Lengkap", key: "name", width: 30 },
        { header: "Username", key: "username", width: 20 },
        { header: "Email", key: "email", width: 35 },
        { header: "Peran", key: "role", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Tanggal Bergabung", key: "created_at", width: 20 },
      ];

      // 3️⃣ Styling HEADER dengan border lengkap
      const headerRow = sheet.getRow(1);
      headerRow.height = 32;

      headerRow.eachCell((cell) => {
        // Font style
        cell.font = {
          bold: true,
          size: 11,
          color: { argb: "FFFFFFFF" },
          name: "Segoe UI",
        };

        // Alignment
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        // Background color - biru gelap
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2563EB" }, // Blue-600
        };

        // ALL BORDER - border lengkap semua sisi
        cell.border = {
          top: { style: "thin", color: { argb: "FF1D4ED8" } },
          left: { style: "thin", color: { argb: "FF1D4ED8" } },
          bottom: { style: "thin", color: { argb: "FF1D4ED8" } },
          right: { style: "thin", color: { argb: "FF1D4ED8" } },
        };
      });

      // 4️⃣ Masukkan data user
      filteredUsers.forEach((user, index) => {
        const row = sheet.addRow({
          no: index + 1,
          name: user.name || "-",
          username: user.username || "-",
          email: user.email || "-",
          role: user.role || "-",
          status: user.is_active ? "AKTIF" : "NONAKTIF",
          created_at: formatDateShort(user.created_at) || "-",
        });

        // Set tinggi row
        row.height = 24;
      });

      // 5️⃣ Styling untuk SEMUA CELL dengan ALL BORDER
      sheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          // ALL BORDER untuk setiap cell
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };

          // Background color berdasarkan status (hanya untuk kolom status)
          if (cell.col === 6 && rowNumber > 1) {
            // Kolom Status adalah kolom ke-6
            const isActive = cell.value === "AKTIF";

            // Warna HIJAU untuk AKTIF
            if (isActive) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDCFCE7" }, // Green-100
              };
              cell.font = {
                bold: true,
                size: 10,
                color: { argb: "FF166534" }, // Green-800
                name: "Segoe UI",
              };
            }
            // Warna MERAH untuk NONAKTIF
            else {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFEE2E2" }, // Red-100
              };
              cell.font = {
                bold: true,
                size: 10,
                color: { argb: "FF991B1B" }, // Red-800
                name: "Segoe UI",
              };
            }

            // Center alignment untuk status
            cell.alignment = {
              vertical: "middle",
              horizontal: "center",
            };

            // Border khusus untuk status (lebih tebal)
            cell.border = {
              top: {
                style: "thin",
                color: { argb: isActive ? "FF86EFAC" : "FFFCA5A5" },
              },
              left: {
                style: "thin",
                color: { argb: isActive ? "FF86EFAC" : "FFFCA5A5" },
              },
              bottom: {
                style: "thin",
                color: { argb: isActive ? "FF86EFAC" : "FFFCA5A5" },
              },
              right: {
                style: "thin",
                color: { argb: isActive ? "FF86EFAC" : "FFFCA5A5" },
              },
            };
          }
          // Styling untuk selain kolom status
          else if (rowNumber > 1) {
            // Font untuk data
            cell.font = {
              size: 10,
              color: { argb: "FF374151" },
              name: "Segoe UI",
            };

            // Alignment berdasarkan tipe kolom
            if (cell.col === 1) {
              // Kolom No
              cell.alignment = {
                vertical: "middle",
                horizontal: "center",
              };
            } else {
              // Kolom lainnya
              cell.alignment = {
                vertical: "middle",
                horizontal: "left",
                wrapText: true,
              };
            }

            // Zebra striping untuk baris
            if (rowNumber % 2 === 0) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF9FAFB" }, // Gray-50
              };
            } else {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // White
              };
            }
          }
        });
      });

      // 6️⃣ Styling khusus untuk kolom No dan Tanggal
      sheet.getColumn("no").eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          cell.font = {
            size: 10,
            color: { argb: "FF6B7280" },
            name: "Segoe UI",
          };
        }
      });

      sheet.getColumn("created_at").eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          cell.font = {
            size: 10,
            color: { argb: "FF6B7280" },
            name: "Segoe UI",
          };
        }
      });

      // 7️⃣ Border luar yang lebih tebal untuk seluruh tabel
      const lastRow = sheet.rowCount;
      const lastCol = sheet.columnCount;

      // Border luar - semua sisi medium
      for (let col = 1; col <= lastCol; col++) {
        // Top border (header)
        const topCell = sheet.getCell(1, col);
        topCell.border.top = { style: "medium", color: { argb: "FF1D4ED8" } };

        // Bottom border (last row)
        const bottomCell = sheet.getCell(lastRow, col);
        bottomCell.border.bottom = {
          style: "medium",
          color: { argb: "FF1D4ED8" },
        };
      }

      // Side borders
      for (let row = 1; row <= lastRow; row++) {
        // Left border
        const leftCell = sheet.getCell(row, 1);
        leftCell.border.left = { style: "medium", color: { argb: "FF1D4ED8" } };

        // Right border
        const rightCell = sheet.getCell(row, lastCol);
        rightCell.border.right = {
          style: "medium",
          color: { argb: "FF1D4ED8" },
        };
      }

      // 8️⃣ Auto fit columns
      sheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          const cellLength = cellValue.length;

          // Adjust for font size
          const adjustedLength = cellLength * 1.2;

          if (adjustedLength > maxLength) {
            maxLength = adjustedLength;
          }
        });

        // Set width with limits
        column.width = Math.min(Math.max(maxLength + 3, 10), 50);
      });

      // 9️⃣ Tambahkan filter di header (opsional)
      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: lastCol },
      };

      // 🔟 Generate file & download
      const buffer = await workbook.xlsx.writeBuffer();
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `Data Pengguna Synapse Bio-Link ( ${formattedDate} ).xlsx`,
      );

      console.log("✅ Data berhasil diekspor dengan border lengkap!");
    } catch (error) {
      console.error("❌ Error exporting data:", error);
      alert("Terjadi kesalahan saat mengekspor data. Silakan coba lagi.");
    }
  };

  return (
    <Layout>
      {/* Confirm Action Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div
            ref={confirmModalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`p-3 rounded-full ${
                    confirmAction.type === "ban" ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {confirmAction.type === "ban" ? (
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {confirmAction.type === "ban"
                      ? "Nonaktifkan Pengguna"
                      : "Aktifkan Pengguna"}
                  </h3>
                  <p className="text-gray-600">
                    {confirmAction.type === "ban"
                      ? `Apakah Anda yakin ingin menonaktifkan akun ${confirmAction.userName}?`
                      : `Apakah Anda yakin ingin mengaktifkan kembali akun ${confirmAction.userName}?`}
                  </p>
                </div>
              </div>

              {/* Tambahkan input alasan ban */}
              {confirmAction.type === "ban" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Penonaktifan
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={banMessage}
                    onChange={(e) => setBanMessage(e.target.value)}
                    placeholder="Masukkan alasan penonaktifan akun pengguna..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Alasan ini akan ditampilkan kepada pengguna saat mencoba
                    login.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {confirmAction.type === "ban"
                      ? "Pengguna tidak akan bisa login sampai diaktifkan kembali."
                      : "Pengguna akan bisa login kembali ke sistem."}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={executeAction}
                  disabled={
                    processingUserId === confirmAction.userId ||
                    (confirmAction.type === "ban" && !banMessage.trim())
                  }
                  className={`flex-1 py-3 font-medium rounded-xl transition-all ${
                    confirmAction.type === "ban"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processingUserId === confirmAction.userId ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memproses...
                    </span>
                  ) : confirmAction.type === "ban" ? (
                    "Ya, Nonaktifkan"
                  ) : (
                    "Ya, Aktifkan"
                  )}
                </button>
                <button
                  onClick={handleCloseConfirmModal}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center p-4 animate-fadeIn">
          <div
            ref={detailModalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
          >
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
                  onClick={handleCloseDetailModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors animate-pulse-once"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Profile Header */}
              <div className="flex items-start gap-6 mb-8 p-4 bg-gradient-to-r from-indigo-50 to-white rounded-xl animate-fadeInDelay">
                <img
                  src={
                    selectedUser.avatar
                      ? `http://localhost:8000/storage/${selectedUser.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedUser.name || "User",
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold animate-pulse-slow ${
                          selectedUser.role === "admin"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {selectedUser.role === "admin"
                          ? "Administrator"
                          : "User"}
                      </span>
                      {selectedUser.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 animate-pulse-slow">
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 animate-pulse-slow">
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
                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg animate-slideUpDelay">
                      <p className="text-gray-700">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    icon: Calendar,
                    label: "Bergabung",
                    value: formatDateShort(selectedUser.created_at),
                    color: "blue",
                  },
                  {
                    icon: Clock,
                    label: "Aktif Terakhir",
                    value: getRelativeTime(selectedUser.last_active),
                    color: "green",
                  },
                  {
                    icon: Activity,
                    label: "Status",
                    value: selectedUser.is_active ? "Online" : "Offline",
                    color: selectedUser.is_active ? "green" : "red",
                  },
                  {
                    icon: Key,
                    label: "User ID",
                    value: selectedUser.id,
                    color: "gray",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 animate-fadeInDelay"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`p-2 bg-white rounded-lg border border-${stat.color}-100`}
                      >
                        <stat.icon
                          className={`w-4 h-4 text-${stat.color}-600`}
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-500">
                        {stat.label}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "red"
                            ? "text-red-600"
                            : stat.color === "blue"
                              ? "text-blue-600"
                              : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div
                className="mb-8 animate-fadeInDelay"
                style={{ animationDelay: "400ms" }}
              >
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Kontak
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                    <div className="p-2 bg-white rounded-lg border border-blue-100">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nomor Telepon</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.phone_number || "Tidak diatur"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300">
                    <div className="p-2 bg-white rounded-lg border border-green-100">
                      <Globe className="w-5 h-5 text-green-600" />
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
              <div
                className="flex gap-3 pt-6 border-t border-gray-200 animate-fadeInDelay"
                style={{ animationDelay: "500ms" }}
              >
                {selectedUser.role !== "admin" && (
                  <>
                    {selectedUser.is_active ? (
                      <button
                        onClick={() => {
                          handleCloseDetailModal();
                          showConfirmActionModal(
                            "ban",
                            selectedUser.id,
                            selectedUser.name,
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      >
                        <Ban className="w-4 h-4" />
                        Nonaktifkan Pengguna
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleCloseDetailModal();
                          showConfirmActionModal(
                            "activate",
                            selectedUser.id,
                            selectedUser.name,
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aktifkan Pengguna
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={handleCloseDetailModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors hover:border-gray-400"
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
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg animate-bounce-slow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Admin
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Selamat datang kembali,{" "}
                    <span className="font-semibold text-indigo-600 animate-pulse-slow">
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
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 hover:border-gray-400"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </button>
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-5 py-3
             bg-gradient-to-r from-emerald-600 to-green-700
             text-white font-medium rounded-xl
             hover:shadow-lg transition-all duration-200
             hover:scale-[1.02]"
              >
                <span className="bg-white p-1 rounded-sm">
                  <img src={ExcelLogo} alt="Excel" className="w-5 h-5" />
                </span>
                Ekspor Excel
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Users,
              color: "blue",
              value: stats.totalUsers,
              label: "Total Pengguna",
              growth: stats.growthRate,
              isPositive: stats.growthRate > 0,
            },
            {
              icon: UserCheck,
              color: "green",
              value: stats.activeUsers,
              label: "Pengguna Aktif",
              percentage: `${stats.userActivity}% aktif`,
            },
            {
              icon: UserX,
              color: "red",
              value: stats.bannedUsers,
              label: "Dinonaktifkan",
              status: stats.bannedUsers > 0 ? "Perlu perhatian" : "Aman",
            },
            {
              icon: Shield,
              color: "purple",
              value: stats.adminUsers,
              label: "Admin Sistem",
              role: "Administrator",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300 hover:scale-[1.02] animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 bg-${stat.color}-50 rounded-xl border border-${stat.color}-100`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                {stat.growth !== undefined ? (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                      stat.isPositive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    } animate-pulse-slow`}
                  >
                    {stat.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.isPositive ? "+" : ""}
                    {stat.growth}%
                  </span>
                ) : stat.percentage ? (
                  <span className="text-xs font-semibold text-green-600 border border-green-200 bg-green-50 px-2 py-1 rounded-full">
                    {stat.percentage}
                  </span>
                ) : (
                  stat.status && (
                    <span
                      className={`text-xs font-semibold ${
                        stat.color === "red"
                          ? "text-red-700 border-red-200 bg-red-50"
                          : "text-green-700 border-green-200 bg-green-50"
                      } px-2 py-1 rounded-full border`}
                    >
                      {stat.status}
                    </span>
                  )
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1 animate-countup">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
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
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-2.5 w-full sm:w-64 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-gray-300 placeholder:text-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Filter Menu */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            Filter Status
                          </p>
                          <div className="space-y-2 mb-4">
                            {[
                              {
                                value: "all",
                                label: "Semua Status",
                                color: "gray",
                              },
                              {
                                value: "active",
                                label: "Aktif",
                                color: "green",
                              },
                              {
                                value: "banned",
                                label: "Dinonaktifkan",
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

                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Filter Peran
                          </p>
                          <div className="space-y-2">
                            {[
                              {
                                value: "all",
                                label: "Semua Peran",
                                color: "gray",
                              },
                              {
                                value: "admin",
                                label: "Administrator",
                                color: "purple",
                              },
                              {
                                value: "user",
                                label: "Pengguna",
                                color: "blue",
                              },
                            ].map((role) => (
                              <label
                                key={role.value}
                                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="role"
                                  checked={roleFilter === role.value}
                                  onChange={() => {
                                    setRoleFilter(role.value);
                                    setShowFilterMenu(false);
                                  }}
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-${role.color}-500`}
                                  ></div>
                                  <span className="text-sm text-gray-700">
                                    {role.label}
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
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer w-full group-hover:border-gray-400 transition-colors"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="name">Nama A-Z</option>
                    <option value="active">Status Aktif</option>
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
                <p className="text-gray-600">Memuat data pengguna...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4 animate-pulse-slow">
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
                  {filteredUsers.map((u, index) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-all duration-150 animate-fadeInRow"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.avatar
                                ? `http://localhost:8000/storage/${u.avatar}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    u.name || "User",
                                  )}&background=6366f1&color=fff&bold=true`
                            }
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform duration-200"
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
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
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
                            className={`w-2 h-2 rounded-full animate-pulse ${
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
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Lihat Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {u.role !== "admin" && (
                            <>
                              {u.is_active ? (
                                <button
                                  onClick={() =>
                                    showConfirmActionModal("ban", u.id, u.name)
                                  }
                                  disabled={processingUserId === u.id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingUserId === u.id ? (
                                    <span className="flex items-center gap-1">
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      Memproses...
                                    </span>
                                  ) : (
                                    "Nonaktifkan"
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    showConfirmActionModal(
                                      "activate",
                                      u.id,
                                      u.name,
                                    )
                                  }
                                  disabled={processingUserId === u.id}
                                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingUserId === u.id ? (
                                    <span className="flex items-center gap-1">
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      Memproses...
                                    </span>
                                  ) : (
                                    "Aktifkan"
                                  )}
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
                <span className="font-semibold text-indigo-600">
                  {filteredUsers.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-900">
                  {users.length}
                </span>{" "}
                pengguna
              </div>
              <div className="flex items-center gap-1 animate-pulse-slow">
                <AlertCircle className="w-4 h-4" />
                <span>Klik ikon mata untuk melihat detail pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out;
        }

        .animate-fadeInDelay {
          animation: fadeIn 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-slideUpDelay {
          animation: slideUp 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-fadeInRow {
          animation: fadeInRow 0.3s ease-out;
          animation-fill-mode: both;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }

        .animate-pulse-once {
          animation: pulseOnce 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s infinite;
        }

        .animate-countup {
          animation: countUp 0.8s ease-out;
        }

        /* Custom scrollbar for modal */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </Layout>
  );
}