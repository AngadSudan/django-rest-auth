import React, { useState, useEffect } from "react";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router";

function PaymentSuccessful() {
  const [countdown, setCountdown] = useState(5);
  const router = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router("/");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    router("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your transaction has been completed
            successfully.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-medium">
            Redirecting to home page in {countdown} seconds...
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleGoHome}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 w-full"
        >
          <Home className="w-5 h-5" />
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessful;
