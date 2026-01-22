import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  RefreshCw,
  LogOut,
  History,
  Eye,
  Calendar,
  MessageSquare,
  Shield,
  AlertCircle,
  Send,
  User,
  Mail,
  Clock as ClockIcon,
  Quote,
  User as UserIcon,
  TrendingUp,
  Package,
  CheckCheck,
  Info,
  FileSearch,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function BannedPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [appealHistory, setAppealHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [latestAppeal, setLatestAppeal] = useState(null);
  const [showDetailedAppeal, setShowDetailedAppeal] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    appeal_reason: "",
    appeal_evidence: "",
  });

  // Fetch appeal history
  const fetchAppealHistory = async () => {
    try {
      setLoadingTracking(true);

      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE}/user/appeals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal fetch appeal history");
      }

      const result = await response.json();
      const data = result.data || [];

      setAppealHistory(data);
      setLatestAppeal(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Gagal mengambil riwayat banding:", error.message);
    } finally {
      setLoadingTracking(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppealHistory();
    }
  }, [user]);

  // Redirect jika user sudah aktif atau belum login
  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.is_active) navigate("/dashboard");
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.appeal_reason.trim()) {
      alert("Harap isi alasan banding terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE}/user/appeals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: formData.appeal_reason,
          appeal_reason: formData.appeal_reason,
          appeal_evidence: formData.appeal_evidence || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengajukan banding");
      }

      setSubmissionSuccess(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCheck,
          iconColor: "text-green-500",
          bgLight: "bg-green-50",
          bgDark: "bg-green-500",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
          bgLight: "bg-red-50",
          bgDark: "bg-red-500",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-500",
          bgLight: "bg-yellow-50",
          bgDark: "bg-yellow-500",
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Diterima";
      case "rejected":
        return "Ditolak";
      default:
        return "Menunggu Review";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-2 shadow-lg">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Akun Dinonaktifkan
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            {user?.ban_message ||
              "Akun Anda telah dinonaktifkan. Ajukan banding untuk mengaktifkan kembali."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-5">
            {/* Latest Appeal Status - Compact Card */}
            {latestAppeal && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div
                  className={`p-3.5 ${
                    latestAppeal.status === "approved"
                      ? "bg-gradient-to-r from-green-50 to-green-100"
                      : latestAppeal.status === "rejected"
                        ? "bg-gradient-to-r from-red-50 to-red-100"
                        : "bg-gradient-to-r from-yellow-50 to-yellow-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {latestAppeal.status === "approved" ? (
                        <CheckCheck className="w-6 h-6 text-green-600" />
                      ) : latestAppeal.status === "rejected" ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {latestAppeal.status === "approved"
                            ? "Banding Diterima"
                            : latestAppeal.status === "rejected"
                              ? "Banding Ditolak"
                              : "Menunggu Review"}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {getTimeAgo(latestAppeal.updated_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetailedAppeal(!showDetailedAppeal)}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      {showDetailedAppeal ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Sembunyikan
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Detail
                        </>
                      )}
                    </button>
                  </div>

                  {/* Admin Reply Preview */}
                  {latestAppeal.admin_reply && !showDetailedAppeal && (
                    <div className="mt-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                      <p className="text-sm text-gray-700 flex items-start gap-2">
                        <Quote className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2">
                          {latestAppeal.admin_reply}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Detailed View */}
                {showDetailedAppeal && (
                  <div className="p-3.5 border-t border-gray-200 space-y-3 bg-gray-50">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Pesan Anda:
                      </p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {latestAppeal.message}
                      </p>
                    </div>

                    {latestAppeal.admin_reply && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Balasan Admin:
                        </p>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                          {latestAppeal.admin_reply}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                      <span>
                        Diajukan: {formatDate(latestAppeal.created_at)}
                      </span>
                      <span>Update: {formatDate(latestAppeal.updated_at)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Banding - Compact */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ajukan Banding
                </h2>
                <button
                  onClick={fetchAppealHistory}
                  disabled={loadingTracking}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      loadingTracking ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              {submissionSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-700 font-medium">
                    Banding berhasil dikirim!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* User Info - Compact */}
                <div className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Alasan Banding */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Alasan Banding <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {formData.appeal_reason.length}/1000
                    </span>
                  </div>
                  <textarea
                    name="appeal_reason"
                    value={formData.appeal_reason}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={1000}
                    className="w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none transition-all"
                    placeholder="Jelaskan mengapa akun seharusnya diaktifkan kembali..."
                    required
                  />
                </div>

                {/* Bukti Pendukung */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bukti Pendukung (Opsional)
                  </label>
                  <textarea
                    name="appeal_evidence"
                    value={formData.appeal_evidence}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none transition-all"
                    placeholder="Link ke screenshot atau dokumen pendukung..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3" />
                    <span>Proses 1-3 hari kerja</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.appeal_reason.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Ajukan Banding
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-5">
            {/* Panduan - Compact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm">Panduan</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>Jelaskan situasi dengan jujur dan detail</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>Sertakan bukti jika memungkinkan</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>Sabar menunggu review admin</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>Jika ditolak, bisa ajukan banding baru</span>
                </li>
              </ul>
            </div>

            {/* History Appeals */}
            {appealHistory.length > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Riwayat Banding
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {appealHistory.length - 1}
                    </span>
                  </div>
                  {showHistory ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {showHistory && (
                  <div className="border-t border-gray-200 max-h-64 overflow-y-auto">
                    {appealHistory.slice(1).map((appeal) => (
                      <div
                        key={appeal.id}
                        className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900">
                            {formatDate(appeal.created_at)}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              appeal.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : appeal.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {getStatusText(appeal.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {appeal.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Keluar Akun</span>
              </button>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Butuh bantuan?</span>
              </div>
              <a
                href="mailto:synapsebioapp@gmail.com"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium block"
              >
                synapsebioapp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}