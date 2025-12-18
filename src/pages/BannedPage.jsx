import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
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
} from "lucide-react";

export default function BannedPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [appealHistory, setAppealHistory] = useState([]);
  const [showTracking, setShowTracking] = useState(true);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [latestAppeal, setLatestAppeal] = useState(null);
  const [formData, setFormData] = useState({
    message: "",
    appeal_reason: "",
    appeal_evidence: "",
  });

  // Fetch appeal history
  const fetchAppealHistory = async () => {
    try {
      setLoadingTracking(true);
      const response = await axios.get(
        "http://localhost:8000/api/user/appeals",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data || [];
      setAppealHistory(data);

      // Get latest appeal
      if (data.length > 0) {
        setLatestAppeal(data[0]);
      } else {
        setLatestAppeal(null);
      }
    } catch (error) {
      console.error(
        "Gagal mengambil riwayat banding:",
        error.response?.data || error.message
      );
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
      const payload = {
        message: formData.appeal_reason,
        appeal_reason: formData.appeal_reason,
        appeal_evidence: formData.appeal_evidence || null,
      };

      const response = await axios.post(
        "http://localhost:8000/api/user/appeals",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success || response.status === 200) {
        setSubmissionSuccess(true);
        setFormData({
          message: "",
          appeal_reason: "",
          appeal_evidence: "",
        });
        // Refresh tracking setelah submit berhasil
        await fetchAppealHistory();
        setTimeout(() => setSubmissionSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.message?.[0] ||
        error.response?.data?.error ||
        "Gagal mengajukan banding. Silakan coba lagi.";
      alert(errorMessage);
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

  const getStatusDescription = (status) => {
    switch (status) {
      case "approved":
        return "Banding Anda telah diterima oleh admin";
      case "rejected":
        return "Banding Anda telah ditolak oleh admin";
      default:
        return "Banding Anda sedang dalam proses review";
    }
  };

  const getTrackingSteps = (status, hasAdminReply) => {
    const steps = [
      {
        id: 1,
        name: "Diajukan",
        description: "Banding telah diajukan",
        icon: Package,
      },
      {
        id: 2,
        name: "Dalam Review",
        description: "Sedang diperiksa admin",
        icon: FileSearch,
      },
      {
        id: 3,
        name: "Diproses",
        description: "Admin memberikan keputusan",
        icon: TrendingUp,
      },
      {
        id: 4,
        name:
          status === "approved"
            ? "Diterima"
            : status === "rejected"
            ? "Ditolak"
            : "Selesai",
        description:
          status === "approved"
            ? "Banding berhasil diterima"
            : status === "rejected"
            ? "Banding ditolak admin"
            : "Keputusan telah dibuat",
        icon:
          status === "approved"
            ? CheckCheck
            : status === "rejected"
            ? XCircle
            : CheckCheck,
      },
    ];

    let activeStep = 1;
    if (status === "pending" && !hasAdminReply) {
      activeStep = 2;
    } else if (status === "pending" && hasAdminReply) {
      activeStep = 3;
    } else if (status === "approved" || status === "rejected") {
      activeStep = 4;
    }

    return steps.map((step) => ({
      ...step,
      active: step.id <= activeStep,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
    return formatDateShort(dateString);
  };

  const renderTrackingStatus = () => {
    if (!latestAppeal) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-700 font-medium mb-2">Belum Ada Banding</h4>
          <p className="text-gray-500 text-sm">
            Ajukan banding pertama Anda untuk melihat status di sini
          </p>
        </div>
      );
    }

    const status = getStatusBadgeColor(latestAppeal.status);
    const StatusIcon = status.icon;
    const trackingSteps = getTrackingSteps(
      latestAppeal.status,
      latestAppeal.admin_reply
    );

    return (
      <div className="space-y-6">
        {/* Status Header with Detailed Status Info */}
        <div
          className={`bg-gradient-to-r p-5 rounded-xl border ${
            latestAppeal.status === "approved"
              ? "from-green-50 to-green-100 border-green-200"
              : latestAppeal.status === "rejected"
              ? "from-red-50 to-red-100 border-red-200"
              : "from-yellow-50 to-yellow-100 border-yellow-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${status.bg} ${status.border}`}>
                <StatusIcon className={`w-6 h-6 ${status.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {latestAppeal.status === "approved"
                    ? "🎉 Banding Diterima!"
                    : latestAppeal.status === "rejected"
                    ? "❌ Banding Ditolak"
                    : "⏳ Menunggu Review"}
                </h3>
                <p className="text-sm text-gray-600">
                  ID: #{latestAppeal.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`px-4 py-2 rounded-full ${status.bg} ${status.text} font-semibold text-sm shadow-sm`}
              >
                {getStatusText(latestAppeal.status)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {getTimeAgo(latestAppeal.updated_at)}
              </p>
            </div>
          </div>

          {/* Status Summary */}
          {latestAppeal.admin_reply && (
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/80 mb-4">
              <div className="flex items-start gap-3">
                <Shield
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    latestAppeal.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {latestAppeal.status === "approved"
                      ? "Admin telah menyetujui banding Anda"
                      : "Admin telah menolak banding Anda"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Keputusan dibuat pada {formatDate(latestAppeal.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Timeline Tracking */}
            <div className="relative pt-2">
              <div className="flex justify-between mb-2">
                {trackingSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="text-center relative z-10 flex-1"
                    >
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all ${
                          step.active
                            ? latestAppeal.status === "approved"
                              ? "bg-green-600 text-white shadow-lg"
                              : latestAppeal.status === "rejected"
                              ? "bg-red-600 text-white shadow-lg"
                              : "bg-indigo-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          step.active ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div
                className="absolute top-6 left-10 right-10 h-0.5 bg-gray-200"
                style={{ zIndex: 0 }}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    latestAppeal.status === "approved"
                      ? "bg-green-600"
                      : latestAppeal.status === "rejected"
                      ? "bg-red-600"
                      : "bg-indigo-600"
                  }`}
                  style={{
                    width:
                      latestAppeal.status === "approved" ||
                      latestAppeal.status === "rejected"
                        ? "100%"
                        : latestAppeal.admin_reply
                        ? "66%"
                        : "33%",
                  }}
                />
              </div>
            </div>

            {/* Message Preview */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Pesan Anda:
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateShort(latestAppeal.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {latestAppeal.message}
                  </p>
                  {!showTracking && (
                    <button
                      onClick={() => setShowTracking(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 font-medium flex items-center gap-1"
                    >
                      Lihat detail lengkap
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View (when expanded) */}
        {showTracking && (
          <div className="space-y-4 animate-slideDown">
            {/* Your Appeal */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Detail Banding Anda
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Pesan Banding:
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {latestAppeal.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-medium">Diajukan:</span>
                      <p className="text-xs">
                        {formatDate(latestAppeal.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-medium">Terakhir Update:</span>
                      <p className="text-xs">
                        {formatDate(latestAppeal.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Response - PROMINENTLY DISPLAYED */}
            {latestAppeal.admin_reply && (
              <div
                className={`rounded-xl p-5 border-2 ${
                  latestAppeal.status === "approved"
                    ? "bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-300"
                    : "bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-300"
                } shadow-md`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      latestAppeal.status === "approved"
                        ? "bg-green-200 shadow-sm"
                        : "bg-red-200 shadow-sm"
                    }`}
                  >
                    <Shield
                      className={`w-6 h-6 ${
                        latestAppeal.status === "approved"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      💬 Balasan Admin
                      {latestAppeal.status === "approved" && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                          DITERIMA
                        </span>
                      )}
                      {latestAppeal.status === "rejected" && (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold">
                          DITOLAK
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Dibalas {getTimeAgo(latestAppeal.updated_at)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <Quote
                      className={`w-5 h-5 flex-shrink-0 mt-1 ${
                        latestAppeal.status === "approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2 text-base leading-relaxed">
                        {latestAppeal.admin_reply}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(latestAppeal.updated_at)}
                        </span>
                        {latestAppeal.status === "approved" && (
                          <span className="flex items-center gap-1 text-green-700 font-semibold text-xs">
                            <CheckCheck className="w-4 h-4" />
                            Akun akan segera aktif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Explanation */}
            <div
              className={`rounded-xl p-4 border-2 ${
                latestAppeal.status === "approved"
                  ? "bg-green-50 border-green-300"
                  : latestAppeal.status === "rejected"
                  ? "bg-red-50 border-red-300"
                  : "bg-yellow-50 border-yellow-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <Info
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    latestAppeal.status === "approved"
                      ? "text-green-600"
                      : latestAppeal.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                />
                <div className="text-sm text-gray-700">
                  <p className="font-bold mb-2 text-base">
                    {latestAppeal.status === "approved"
                      ? "✅ Status: Banding Diterima"
                      : latestAppeal.status === "rejected"
                      ? "❌ Status: Banding Ditolak"
                      : "⏳ Status: Menunggu Review"}
                  </p>
                  <p className="leading-relaxed">
                    {latestAppeal.status === "approved"
                      ? "Selamat! Banding Anda telah disetujui oleh admin. Akun Anda akan segera diaktifkan kembali dalam waktu dekat. Terima kasih atas kesabaran Anda."
                      : latestAppeal.status === "rejected"
                      ? "Mohon maaf, banding Anda telah ditinjau dan ditolak oleh admin. Anda masih dapat mengajukan banding baru dengan memberikan penjelasan yang lebih detail dan bukti pendukung yang lebih kuat untuk pertimbangan lebih lanjut."
                      : "Banding Anda sedang dalam antrian review. Tim admin kami akan memeriksa dan memproses banding Anda dengan teliti. Proses ini biasanya membutuhkan waktu 1-3 hari kerja. Mohon bersabar menunggu."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous Appeals (if any) */}
        {appealHistory.length > 1 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <History className="w-4 h-4" />
                Riwayat Banding Sebelumnya
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {appealHistory.length - 1} banding
              </span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {appealHistory.slice(1).map((appeal) => {
                const appealStatus = getStatusBadgeColor(appeal.status);
                return (
                  <div
                    key={appeal.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          appeal.status === "approved"
                            ? "bg-green-500"
                            : appeal.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-1 mb-1">
                          {appeal.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDateShort(appeal.created_at)}</span>
                          <span>•</span>
                          <span
                            className={`font-medium ${
                              appeal.status === "approved"
                                ? "text-green-600"
                                : appeal.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {getStatusText(appeal.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Akun Dinonaktifkan
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              {user?.ban_message ||
                "Maaf, akun Anda telah dinonaktifkan sementara oleh administrator sistem."}
            </p>
            <p className="text-gray-500">
              Anda dapat mengajukan banding untuk mengaktifkan kembali akun
              Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Formulir Pengajuan Banding
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTracking(!showTracking)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <History className="w-4 h-4" />
                    {showTracking ? "Sembunyikan" : "Tampilkan"} Tracking
                  </button>
                  <button
                    onClick={fetchAppealHistory}
                    disabled={loadingTracking}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh status"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        loadingTracking ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {submissionSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium">
                        Pengajuan banding berhasil dikirim!
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Banding Anda sedang dalam proses review oleh admin.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appeal Reason */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Alasan Banding <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {formData.appeal_reason.length}/1000 karakter
                    </span>
                  </div>
                  <textarea
                    name="appeal_reason"
                    value={formData.appeal_reason}
                    onChange={handleInputChange}
                    rows={5}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Jelaskan secara detail mengapa Anda merasa akun seharusnya diaktifkan kembali. Berikan penjelasan yang jelas dan informatif..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Jelaskan situasi Anda dengan jelas. Semakin detail
                    penjelasan Anda, semakin besar peluang banding diterima.
                  </p>
                </div>

                {/* Supporting Evidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Bukti Pendukung (Opsional)
                    </div>
                  </label>
                  <textarea
                    name="appeal_evidence"
                    value={formData.appeal_evidence}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Contoh: Link ke screenshot, email, atau dokumen pendukung lainnya..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Anda dapat menyertakan tautan ke bukti pendukung untuk
                    memperkuat alasan banding Anda.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>Biasanya diproses dalam 1-3 hari kerja</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.appeal_reason.trim()}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
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
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Tracking & Info */}
          <div className="space-y-8">
            {/* Tracking Panel */}
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Tracking Banding
                    </h3>
                  </div>
                  {appealHistory.length > 0 && (
                    <div className="text-xs font-medium text-gray-600">
                      Total: {appealHistory.length}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {loadingTracking ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-3" />
                    <p className="text-gray-500 text-sm">Memuat status...</p>
                  </div>
                ) : (
                  renderTrackingStatus()
                )}
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Panduan Banding
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Sampaikan dengan jujur:</span>{" "}
                    Jelaskan situasi Anda dengan detail dan kejujuran.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Perhatikan status:</span> Cek
                    tracking untuk melihat perkembangan banding Anda.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Sabar menunggu:</span> Proses
                    review membutuhkan waktu 1-3 hari kerja.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Jika ditolak:</span> Anda bisa
                    ajukan banding baru dengan penjelasan yang lebih baik.
                  </p>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="space-y-3">
                <button
                  onClick={() => setShowTracking(!showTracking)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 group"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      showTracking ? "bg-indigo-100" : "bg-gray-100"
                    } group-hover:bg-indigo-50 transition-colors`}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="flex-1 text-left">
                    {showTracking
                      ? "Sembunyikan Tracking"
                      : "Tampilkan Tracking"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="p-2 rounded-lg bg-gray-200 group-hover:bg-gray-300 transition-colors">
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="flex-1 text-left">Keluar Akun</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Butuh bantuan? Hubungi{" "}
              <a
                href="mailto:support@example.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 2000px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
          overflow: hidden;
        }

        /* Custom scrollbar */
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
    </div>
  );
}