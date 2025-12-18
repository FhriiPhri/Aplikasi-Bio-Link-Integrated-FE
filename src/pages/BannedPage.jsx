import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function BannedPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [appealHistory, setAppealHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    message: "", // Field yang dibutuhkan API
    appeal_reason: "",
    appeal_evidence: "",
  });

  // Fetch appeal history
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

  const fetchAppealHistory = async () => {
    try {
      const response = await axios.get("/api/user/appeals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setAppealHistory(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil riwayat banding:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Gabungkan appeal_reason ke message jika diperlukan
      const payload = {
        message: formData.message || formData.appeal_reason,
        appeal_reason: formData.appeal_reason,
        appeal_evidence: formData.appeal_evidence || null,
      };

      const response = await axios.post("/api/user/appeals", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success || response.status === 200) {
        setSubmissionSuccess(true);
        setFormData({
          message: "",
          appeal_reason: "",
          appeal_evidence: "",
        });
        fetchAppealHistory();
        setTimeout(() => setSubmissionSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      alert(
        error.response?.data?.message ||
          error.response?.data?.errors?.message?.[0] ||
          "Gagal mengajukan banding"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Diterima";
      case "rejected":
        return "Ditolak";
      default:
        return "Menunggu";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Akun Dinonaktifkan
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {user?.ban_message ||
              "Maaf, akun Anda telah dinonaktifkan oleh administrator sistem."}
          </p>
          <p className="text-gray-500">
            Silakan ajukan banding untuk mengaktifkan kembali akun Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Formulir Pengajuan Banding
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Riwayat Banding
                </button>
              </div>

              {submissionSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-700 font-medium">
                      Pengajuan banding berhasil dikirim!
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field message sebagai fallback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Banding *
                  </label>
                  <textarea
                    name="appeal_reason"
                    value={formData.appeal_reason}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Jelaskan mengapa Anda merasa akun seharusnya diaktifkan kembali..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Berikan penjelasan yang jelas dan detail tentang situasi
                    Anda.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan Tambahan (Opsional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Tambahkan informasi lain yang ingin disampaikan..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Field ini akan dikirim sebagai 'message' ke sistem.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Pendukung (Opsional)
                  </label>
                  <textarea
                    name="appeal_evidence"
                    value={formData.appeal_evidence}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Tambahkan tautan atau informasi pendukung lainnya..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Anda dapat menyertakan tautan ke bukti pendukung jika
                    diperlukan.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>Banding akan diproses dalam 1-3 hari kerja.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Mengirim...
                        </span>
                      ) : (
                        "Ajukan Banding"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Info & History */}
          <div className="space-y-8">
            {/* Appeal History Panel */}
            {showHistory && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Riwayat Banding
                </h3>
                <div className="space-y-4">
                  {appealHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Belum ada riwayat banding
                    </p>
                  ) : (
                    appealHistory.map((appeal) => (
                      <div
                        key={appeal.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              appeal.status
                            )}`}
                          >
                            {getStatusText(appeal.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(appeal.created_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {appeal.message || appeal.appeal_reason}
                        </p>
                        {appeal.admin_reply && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-600">
                              Balasan Admin:
                            </p>
                            <p className="text-sm text-gray-700">
                              {appeal.admin_reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informasi Penting
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Proses review membutuhkan waktu 1-3 hari kerja
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Pastikan informasi yang diberikan valid dan benar
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Anda dapat melacak status banding di halaman ini
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {showHistory
                    ? "Sembunyikan Riwayat"
                    : "Lihat Riwayat Banding"}
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Keluar Akun
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Butuh bantuan? Hubungi{" "}
            <a
              href="mailto:support@example.com"
              className="text-indigo-600 hover:text-indigo-700"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}