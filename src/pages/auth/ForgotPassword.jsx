import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Key,
  User,
  AlertCircle,
  Copy,
} from "lucide-react";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPasteNotification, setShowPasteNotification] = useState(false);

  // Backend API base URL - sesuaikan dengan URL backend Laravel
  const API_BASE_URL = "http://localhost:8000/api";

  // Create refs for OTP inputs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const containerRef = useRef(null);

  // Handle paste for OTP - Auto-fill all 6 digits
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain");
      const numbersOnly = pastedData.replace(/\D/g, "");

      if (numbersOnly.length >= 6) {
        const digits = numbersOnly.slice(0, 6).split("");
        const newOtp = [...otp];

        digits.forEach((digit, index) => {
          newOtp[index] = digit;
        });

        setOtp(newOtp);

        setShowPasteNotification(true);
        setTimeout(() => setShowPasteNotification(false), 2000);

        setTimeout(() => {
          const verifyButton = document.querySelector('button[type="submit"]');
          if (verifyButton) verifyButton.focus();
        }, 100);
      }
    },
    [otp]
  );

  // Countdown for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(30);
  };

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  // Handle OTP input - Auto-focus next
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5 && otpRefs[index + 1]?.current) {
      setTimeout(() => otpRefs[index + 1].current.focus(), 10);
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setTimeout(() => otpRefs[index - 1].current.focus(), 10);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.ctrlKey && e.key === "v") {
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      setTimeout(() => otpRefs[index - 1].current.focus(), 10);
    }
    if (e.key === "ArrowRight" && index < 5) {
      setTimeout(() => otpRefs[index + 1].current.focus(), 10);
    }
  };

  const getOtpString = () => otp.join("");

  // Step 1: Send OTP - BACKEND INTEGRATION
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMessage({
        text: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setMessage({
        text:
          data.message ||
          "Verification code has been sent to your email. Check your inbox.",
        type: "success",
      });
      setStep(2);
      startCountdown();

      setTimeout(() => {
        if (otpRefs[0]?.current) otpRefs[0].current.focus();
      }, 100);
    } catch (err) {
      setMessage({
        text: err.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP - BACKEND INTEGRATION
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setMessage({
        text: data.message || "New verification code sent to your email.",
        type: "success",
      });
      startCountdown();
    } catch (err) {
      setMessage({
        text: err.message || "Failed to resend code.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP - BACKEND INTEGRATION
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = getOtpString();
    if (otpString.length !== 6) {
      setMessage({
        text: "Please enter the complete 6-digit code.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setMessage({
        text:
          data.message ||
          "Verification successful. You can now set your new password.",
        type: "success",
      });
      setStep(3);

      setTimeout(() => {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) passwordInput.focus();
      }, 100);
    } catch (err) {
      setMessage({
        text: err.message || "Verification failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password - BACKEND INTEGRATION
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setMessage({
        text: "Passwords do not match.",
        type: "error",
      });
      return;
    }
    if (passwordStrength < 3) {
      setMessage({
        text: "Please use a stronger password with at least 8 characters including uppercase, numbers, and symbols.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage({
        text:
          data.message ||
          "Password successfully reset! You can now log in with your new password.",
        type: "success",
      });
      setStep(4);
    } catch (err) {
      setMessage({
        text: err.message || "Failed to reset password. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all OTP inputs
  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    if (otpRefs[0]?.current) otpRefs[0].current.focus();
  };

  // Message display effect
  useEffect(() => {
    if (!message.text) return;

    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  // Auto-clear message after fade
  useEffect(() => {
    if (!showMessage && message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showMessage, message]);

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Verify Email", icon: Mail },
      { number: 2, label: "Enter Code", icon: ShieldCheck },
      { number: 3, label: "New Password", icon: Lock },
      { number: 4, label: "Complete", icon: CheckCircle },
    ];

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 -z-10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-in-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>

          {steps.map((stepItem) => {
            const Icon = stepItem.icon;
            const isActive = stepItem.number === step;
            const isCompleted = stepItem.number < step;
            const isAccessible = stepItem.number <= step;

            return (
              <div key={stepItem.number} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isAccessible && setStep(stepItem.number)}
                  disabled={!isAccessible}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300 mb-2
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white shadow-md"
                        : ""
                    }
                    ${
                      isActive
                        ? "bg-white border-blue-500 text-blue-500 shadow-lg scale-110"
                        : "border-gray-300 bg-white"
                    }
                    ${
                      !isAccessible
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:scale-105"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`
                  text-xs font-medium transition-colors
                  ${isActive ? "text-blue-600" : "text-gray-500"}
                  ${isCompleted ? "text-blue-500" : ""}
                `}
                >
                  {stepItem.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-400";
    if (strength === 3) return "bg-blue-400";
    return "bg-green-500";
  };

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0:
        return "Enter password";
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getPasswordCriteria = () => {
    const criteria = [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains number", met: /[0-9]/.test(password) },
      {
        label: "Contains special character",
        met: /[^A-Za-z0-9]/.test(password),
      },
    ];
    return criteria;
  };

  // Copy OTP to clipboard (for testing)
  const copyTestOtp = () => {
    navigator.clipboard.writeText("123456");
    setMessage({
      text: "Test OTP '123456' copied to clipboard. You can paste it now.",
      type: "success",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
                <Key className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Reset Your Password
              </h1>
              <p className="text-gray-600 text-base">
                Follow these steps to securely reset your password
              </p>
            </div>

            {renderStepIndicator()}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="block w-full pl-10 pr-4 py-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your email address to receive a verification code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-gray-800">{email}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    You can paste the entire code to auto-fill all fields
                  </p>
                </div>

                {/* OTP Inputs Container with paste handler */}
                <div className="mb-6" onPaste={handlePaste}>
                  <div className="flex text-black justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        pattern="\d"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white shadow-sm"
                        aria-label={`Digit ${index + 1} of 6`}
                      />
                    ))}
                  </div>

                  {/* OTP Actions */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={clearOtp}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Clear all
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {countdown > 0
                        ? `Resend code in ${countdown}s`
                        : "Resend code"}
                    </button>
                  </div>
                </div>

                {/* Paste Success Notification */}
                {showPasteNotification && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm text-center animate-fadeIn">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>OTP pasted successfully! All fields filled.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp}>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || getOtpString().length !== 6}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        New Password
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="block w-full pl-10 pr-4 py-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      />
                    </div>

                    {password && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Password strength
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {getStrengthLabel(passwordStrength)}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                i <= passwordStrength
                                  ? getStrengthColor(passwordStrength)
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {getPasswordCriteria().map((criterion, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  criterion.met ? "bg-green-500" : "bg-gray-300"
                                }`}
                              />
                              <span
                                className={`text-xs ${
                                  criterion.met
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {criterion.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                        Confirm Password
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Re-enter your password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={`block w-full pl-10 pr-4 py-4 text-gray-900 placeholder-gray-400 border rounded-xl focus:ring-2 outline-none transition-all bg-white ${
                          passwordConfirm && password !== passwordConfirm
                            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    {passwordConfirm && password !== passwordConfirm && (
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">
                          Passwords do not match
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      password !== passwordConfirm ||
                      passwordStrength < 3
                    }
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Resetting...
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
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-lg">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600 mb-10 max-w-md mx-auto text-base leading-relaxed">
                  Your password has been successfully updated. You can now log
                  in to your account with your new password.
                </p>
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Continue to Login
                  </Link>
                  <Link
                    to="/"
                    className="block w-full border border-gray-300 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message.text && step !== 4 && (
              <div
                className={`mt-8 p-4 rounded-xl border transition-all duration-500 transform ${
                  showMessage
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                } ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            {step < 4 && (
              <div className="mt-10 text-center pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need assistance?{" "}
            <a
              href="mailto:support@synapse.com"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}