import * as React from "react";
import { Check, CreditCard, Shield, Star } from "lucide-react";
import configuraton from "../conf/configuration";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate } from "react-router";
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Predefined plans configuration
const PLANS = {
  premium: {
    name: "Premium",
    description: "Perfect for individuals and small teams",
    features: [
      "Expert tax guidance",
      "Priority support",
      "Advanced analytics",
      "Custom reports",
    ],
    monthly: 4000,
    yearly: 40000,
    popular: true,
  },
  pro: {
    name: "Pro",
    description: "Best for growing businesses and professionals",
    features: [
      "Everything in Premium",
      "Team collaboration",
      "API access",
      "White-label options",
    ],
    monthly: 8000,
    yearly: 80000,
    popular: false,
  },
};

function CheckoutLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
        <p className="text-gray-600 font-medium">Preparing your checkout...</p>
      </div>
    </div>
  );
}

function PlanSelection({
  onSelectPlan,
}: {
  onSelectPlan: (planType: string, billing: string) => void;
}) {
  const [selectedBilling, setSelectedBilling] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  const router = useNavigate();
  React.useEffect(() => {
    const authToken = Cookie.get("authtoken");
    console.log(authToken + "-----------");
    if (!authToken) {
      router("/login");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setSelectedBilling("monthly")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedBilling === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedBilling("yearly")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedBilling === "yearly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(PLANS).map(([planType, plan]) => (
            <div
              key={planType}
              className={`bg-white rounded-2xl shadow-xl border p-8 relative transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan[selectedBilling].toLocaleString()}
                  </span>
                  <span className="text-gray-600">/{selectedBilling}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectPlan(planType, selectedBilling)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    : "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckoutContent({
  planType,
  billing,
  onBack,
}: {
  planType: string;
  billing: string;
  onBack: () => void;
}) {
  const [loading1, setLoading1] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const idRef = React.useRef("");
  const [orderError, setOrderError] = React.useState<string | null>(null);

  const selectedPlan = PLANS[planType as keyof typeof PLANS];
  const amount = selectedPlan[billing as keyof typeof selectedPlan] as number;
  const router = useNavigate();
  React.useEffect(() => {
    const authToken = Cookie.get("authtoken");
    console.log(authToken + "-----------");
    if (!authToken) {
      router("/login");
    }
  }, []);
  React.useEffect(() => {
    async function createOrderId() {
      try {
        const csrftoken = Cookie.get("csrftoken");
        console.log("Token being sent:", Cookie.get("authtoken"));
        const response = await axios.post(
          configuraton.backend_url + "/api/v1/auth/razorpay_order/",
          {
            amount: amount * 100,
            planType,
            billing,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
              Authorization: `Token ${Cookie.get("authtoken")}`,
            },
            // withCredentials: true,
          }
        );
        const { orderId } = response.data;
        idRef.current = orderId;
      } catch (err) {
        setOrderError("Failed to create order.");
      } finally {
        setLoading1(false);
      }
    }
    createOrderId();
  }, [amount, planType, billing]);

  React.useEffect(() => {
    // Dynamically load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const orderId = idRef.current;
    if (!orderId) {
      setLoading(false);
      return;
    }

    const options = {
      key: configuraton.RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Dr. Web",
      description: `${
        selectedPlan.name
      } Plan (${billing}) - ₹${amount.toLocaleString()}`,
      order_id: orderId,
      handler: async (response: any) => {
        const csrftoken = Cookie.get("csrftoken");
        const { data } = await axios.post(
          configuraton.backend_url + "/api/v1/auth/razorpay_callback/",
          {
            razorpay_order_id: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planType,
            billing,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
              Authorization: "Token " + Cookie.get("authtoken"),
            },
          }
        );
        router("/success");
      },
      theme: { color: "#3B82F6" },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err: any) => {
        alert(err.error.description);
        router("/failiure");
      });
      rzp.open();
    } else {
      alert("Payment gateway not available.");
    }
    setLoading(false);
  };

  if (loading1) return <CheckoutLoader />;
  if (orderError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">⚠️ {orderError}</div>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h2>
          <p className="text-gray-600">
            You're one step away from getting started
          </p>
        </div>

        {/* Checkout Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

          {/* Plan Summary */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedPlan.name} Plan
                </h3>
                <p className="text-gray-600 mt-1">{selectedPlan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{amount.toLocaleString()}
                </div>
                <div className="text-gray-600">/{billing}</div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                What's included:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium text-gray-900 capitalize">
                  {billing}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-4">
              <button
                onClick={() =>
                  processPayment({
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>)
                }
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pay Securely with Razorpay
                  </div>
                )}
              </button>

              <button
                onClick={onBack}
                className="w-full py-3 px-6 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                Back to Plans
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-3">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure payment powered by Razorpay</span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              By proceeding, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const [step, setStep] = React.useState<"plans" | "checkout">("plans");
  const [selectedPlan, setSelectedPlan] = React.useState<{
    planType: string;
    billing: string;
  }>({ planType: "", billing: "" });

  if (step === "plans") {
    return (
      <PlanSelection
        onSelectPlan={(planType, billing) => {
          setSelectedPlan({ planType, billing });
          setStep("checkout");
        }}
      />
    );
  }

  return (
    <CheckoutContent
      planType={selectedPlan.planType}
      billing={selectedPlan.billing}
      onBack={() => setStep("plans")}
    />
  );
}
