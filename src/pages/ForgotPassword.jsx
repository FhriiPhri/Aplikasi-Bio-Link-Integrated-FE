import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showMessage, setShowMessage] = useState(false); // kontrol fade

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/send-otp", { email });
      setMessage(res.data.message || "OTP telah dikirim ke email Anda!");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.error || "Terjadi kesalahan!");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/verify-otp", { email, otp });
      setMessage(res.data.message || "OTP valid!");
      setStep(3);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "OTP salah atau sudah kedaluwarsa!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setMessage("Password dan konfirmasi harus sama!");
      return;
    }
    if (passwordStrength < 3) {
      setMessage("Password terlalu lemah. Gunakan kombinasi yang lebih kuat!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/reset-password", {
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      setMessage(res.data.message || "Password berhasil direset!");
      setStep(4);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset password gagal!");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Email", icon: Mail },
      { number: 2, label: "OTP", icon: ShieldCheck },
      { number: 3, label: "Password", icon: Lock },
      { number: 4, label: "Selesai", icon: CheckCircle },
    ];

    useEffect(() => {
      if (!message) return;
      setShowMessage(true);

      const timer = setTimeout(() => {
        setShowMessage(false); // mulai fade out
      }, 5000); // 5 detik sebelum fade

      return () => clearTimeout(timer);
    }, [message]);

    // Hapus message setelah fade selesai
    useEffect(() => {
      if (!showMessage && message) {
        const timer = setTimeout(() => setMessage(""), 500); // 1 detik fade
        return () => clearTimeout(timer);
      }
    }, [showMessage, message]);

    return (
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>

        {steps.map((stepItem) => {
          const Icon = stepItem.icon;
          const isActive = stepItem.number === step;
          const isCompleted = stepItem.number < step;

          return (
            <div key={stepItem.number} className="flex flex-col items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center
                border-2 transition-all duration-300
                ${isCompleted ? "bg-blue-500 border-blue-500" : ""}
                ${
                  isActive
                    ? "border-blue-500 bg-white"
                    : "border-gray-300 bg-white"
                }
              `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Ikuti langkah-langkah berikut untuk mereset password Anda
              </p>
            </div>

            {renderStepIndicator()}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim OTP"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Verifikasi
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Masukkan 6-digit kode yang dikirim ke{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-xl tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      "Verifikasi"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    {password && (
                      <div className="mt-3">
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i <= passwordStrength
                                  ? getStrengthColor(passwordStrength)
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          {passwordStrength === 0 && "Masukkan password"}
                          {passwordStrength === 1 && "Password sangat lemah"}
                          {passwordStrength === 2 && "Password lemah"}
                          {passwordStrength === 3 && "Password cukup"}
                          {passwordStrength === 4 && "Password kuat"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Ulangi password baru"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
                          passwordConfirm && password !== passwordConfirm
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    {passwordConfirm && password !== passwordConfirm && (
                      <p className="mt-2 text-sm text-red-600">
                        Password tidak cocok
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      password !== passwordConfirm ||
                      passwordStrength < 3
                    }
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Password Berhasil Direset!
                </h3>
                <p className="text-gray-600 mb-8">
                  Password Anda telah berhasil diubah. Silakan login dengan
                  password baru Anda.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Login Sekarang
                </Link>
              </div>
            )}

            {/* Message Display */}
            {message && step !== 4 && (
              <div
                className={`mt-6 p-4 rounded-lg text-sm transition-opacity duration-1000 ${
                  message.includes("berhasil") ||
                  message.includes("OTP valid") ||
                  message.includes("dikirim")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                } ${showMessage ? "opacity-100" : "opacity-0"}`}
              >
                {message}
              </div>
            )}

            {/* Back to Login */}
            {step < 4 && (
              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Kembali ke halaman login
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Butuh bantuan?{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              Hubungi support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}