import React, { useState, useEffect } from "react";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";

function PaymentFailed() {
  const [countdown, setCountdown] = useState(10);
  // In your real app, uncomment this line:
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate("/checkout"); // or wherever your checkout page is
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            We're sorry, but your payment could not be processed. Please check
            your payment details and try again.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">
            Redirecting to home page in {countdown} seconds...
          </p>
          <div className="w-full bg-red-200 rounded-full h-2 mt-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((10 - countdown) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleTryAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 flex-1"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 flex-1"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
