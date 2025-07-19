import React, { useState } from "react";
import {
  Mail,
  Shield,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Router, useNavigate } from "react-router";
import configuraton from "../conf/configuration";
import axios from "axios";

// API service functions (replace these URLs with your actual backend endpoints)
const API_BASE_URL = "https://your-api-url.com/api";

const apiService = {
  // Generate OTP API call
  generateOTP: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/generate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }

    return response.json();
  },

  // Validate OTP API call
  validateOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/validate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error("Invalid OTP");
    }

    return response.json();
  },

  // Reset password API call
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!response.ok) {
      throw new Error("Failed to reset password");
    }

    return response.json();
  },
};

// Step 1: Email Input Component
function EmailStep({ onNext, email, setEmail, loading, error }: any) {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you an OTP to reset your
          password
        </p>
      </div>

      <div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
            disabled={loading}
            onKeyPress={(e) => e.key === "Enter" && onNext()}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={onNext}
          disabled={loading || !email}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </div>
    </div>
  );
}

// Step 2: OTP Verification Component
function OTPStep({
  email,
  onNext,
  onBack,
  onResend,
  loading,
  error,
  resendLoading,
}: any) {
  const [otp, setOTP] = useState("");

  const handleOTPChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOTP(value);
  };

  const handleNext = () => {
    if (otp.length === 6) {
      onNext(otp);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
        <p className="text-gray-600">
          We've sent a 6-digit OTP to{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <div>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOTPChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength={6}
            disabled={loading}
            onKeyPress={(e) =>
              e.key === "Enter" && otp.length === 6 && handleNext()
            }
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={loading || otp.length !== 6}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center mb-4"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="flex items-center justify-between text-sm">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition duration-200"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Email
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 3: Password Reset Component
function PasswordResetStep({
  email,
  otp,
  onNext,
  onBack,
  loading,
  error,
}: any) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validatePassword = (pwd: string) => {
    const errors = [];
    if (pwd.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(pwd))
      errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(pwd))
      errors.push("Password must contain at least one lowercase letter");
    if (!/\d/.test(pwd))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      errors.push("Password must contain at least one special character");
    return errors;
  };

  const handlePasswordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidationErrors(validatePassword(newPassword));
  };

  const handleNext = () => {
    if (password !== confirmPassword) {
      return;
    }
    if (validationErrors.length === 0 && password) {
      onNext(password);
    }
  };

  const isFormValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    validationErrors.length === 0;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">Create a new password for your account</p>
      </div>

      <div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {validationErrors.length > 0 && (
            <div className="mt-2">
              {validationErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">
                  • {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm new password"
              disabled={loading}
              onKeyPress={(e) =>
                e.key === "Enter" && isFormValid && handleNext()
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={loading || !isFormValid}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center mb-4"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessStep({ onComplete }: any) {
  const router = useNavigate();
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your password has been successfully reset. You can now login with your
          new password.
        </p>

        <button
          onClick={() => {
            router("/");
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password, 4: Success
  const [email, setEmail] = useState("");
  const [verifiedOTP, setVerifiedOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        configuraton.backend_url + "/api/v1/auth/otp/",
        {
          email,
        }
      );
      console.log(response);
      setError("");
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        configuraton.backend_url + "/api/v1/auth/verify_otp/",
        {
          email,
          otp,
        }
      );
      console.log(response);
      setVerifiedOTP(otp);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (newPassword: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        configuraton.backend_url + "/api/v1/auth/reset-password/",
        {
          email,
          password: newPassword,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleGoBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Navigate to login page or reset the component
    console.log("Navigate to login page");
    // Reset component state
    setCurrentStep(1);
    setEmail("");
    setVerifiedOTP("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Progress Indicator */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Email</span>
          <span>OTP</span>
          <span>Password</span>
          <span>Success</span>
        </div>
      </div>

      {/* Step Components */}
      {currentStep === 1 && (
        <EmailStep
          onNext={handleSendOTP}
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === 2 && (
        <OTPStep
          email={email}
          onNext={handleVerifyOTP}
          onBack={handleGoBack}
          onResend={handleResendOTP}
          loading={loading}
          error={error}
          resendLoading={resendLoading}
        />
      )}

      {currentStep === 3 && (
        <PasswordResetStep
          email={email}
          otp={verifiedOTP}
          onNext={handleResetPassword}
          onBack={handleGoBack}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === 4 && <SuccessStep onComplete={handleComplete} />}
    </div>
  );
}

export default ForgotPassword;
