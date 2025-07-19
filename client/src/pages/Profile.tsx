import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Clock,
  CreditCard,
  Crown,
  CheckCircle,
  AlertCircle,
  Edit3,
  Settings,
  Bell,
  Shield,
  Download,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import { Link } from "react-router";
import axios from "axios";
import configuraton from "../conf/configuration";
import Cookie from "js-cookie";
interface subscription {
  subscription_id: string;
  plan: string;
  amount: number;
  bought_date: string;
  expiry_date: string;
}
interface userProfile {
  username: string;
  email: string;
  profile: {
    lastLoggedIn: string;
    created_at: string;
    subscription_id: string;
  };
  subscriptions: subscription[];
}
function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<userProfile>({
    username: "angad",
    email: "angadsudan453@gmail.com",
    profile: {
      lastLoggedIn: "2025-07-19T16:37:28.512559Z",
      created_at: "2025-07-18T16:04:03.231589Z",
      subscription_id: "31d8b26b-ff74-4974-86f7-6f231e0a46f2",
    },
    subscriptions: [
      {
        subscription_id: "1022de93-f266-4777-8bc5-7a7569047647",
        plan: "premium-monthly",
        amount: 300,
        bought_date: "2025-07-18",
        expiry_date: "2025-08-17",
      },
      {
        subscription_id: "c73d7de2-d20a-4bcc-8ed8-0e80cff4a918",
        plan: "premium-yearly",
        amount: 3000,
        bought_date: "2025-07-18",
        expiry_date: "2026-08-17",
      },
      {
        subscription_id: "31d8b26b-ff74-4974-86f7-6f231e0a46f2",
        plan: "premium-monthly",
        amount: 300,
        bought_date: "2025-07-19",
        expiry_date: "2026-09-16",
      },
    ],
  });

  useEffect(() => {
    const csrftoken = Cookie.get("csrftoken");
    const authToken = Cookie.get("authtoken");
    const fetchUser = async () => {
      const response = await axios.post(
        configuraton.backend_url + "/api/v1/auth/profile/",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            Authorization: "Token " + authToken,
          },
        }
      );
      console.log(response.data.data);
      setUserData(response.data.data);
    };
    fetchUser();
  }, []);
  const activeSubscription = userData?.subscriptions?.find(
    (sub) => sub.subscription_id === userData?.profile?.subscription_id
  );

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get subscription status
  const getSubscriptionStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry > today ? "active" : "expired";
  };

  // Get plan display name
  const getPlanDisplayName = (plan: string) => {
    return plan
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "subscriptions", name: "Subscriptions", icon: Crown },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {userData.username}
                  </h1>
                  <p className="text-blue-100 text-lg mb-4">{userData.email}</p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-blue-100">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {formatDate(userData.profile.created_at)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last seen {formatDateTime(userData.profile.lastLoggedIn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Account Stats */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">
                            Current Plan
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {getPlanDisplayName(
                              activeSubscription?.plan || "free"
                            )}
                          </p>
                        </div>
                        <Crown className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">
                            Total Subscriptions
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {userData &&
                              userData.subscriptions &&
                              userData.subscriptions.length}
                          </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">
                            Account Status
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            Active
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                  </div>

                  {/* Active Subscription Details */}
                  {activeSubscription && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Crown className="w-5 h-5 mr-2" />
                        Active Subscription
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-blue-100 text-sm">Plan</p>
                          <p className="text-xl font-semibold">
                            {getPlanDisplayName(activeSubscription.plan)}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">Amount Paid</p>
                          <p className="text-xl font-semibold">
                            ₹{activeSubscription.amount}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">Next Billing</p>
                          <p className="text-xl font-semibold">
                            {formatDate(activeSubscription.expiry_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">Status</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === "subscriptions" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Subscription History
                    </h3>
                    <Link
                      to="/checkout"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                    >
                      Upgrade Plan
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {userData &&
                      userData.subscriptions &&
                      userData.subscriptions.map((subscriptions, index) => {
                        const status = getSubscriptionStatus(
                          subscriptions.expiry_date
                        );
                        const isActive =
                          subscriptions.subscription_id ===
                          userData.profile.subscription_id;

                        return (
                          <div
                            key={subscriptions.subscription_id}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                              isActive
                                ? "border-blue-200 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex items-start space-x-4">
                                <div
                                  className={`p-3 rounded-xl ${
                                    status === "active"
                                      ? "bg-green-100"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  <Crown
                                    className={`w-6 h-6 ${
                                      status === "active"
                                        ? "text-green-600"
                                        : "text-gray-600"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                      {getPlanDisplayName(subscriptions.plan)}
                                    </h4>
                                    {isActive && (
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600">
                                    {formatDate(subscriptions.bought_date)} -{" "}
                                    {formatDate(subscriptions.expiry_date)}
                                  </p>
                                  <p className="text-2xl font-bold text-gray-900 mt-1">
                                    ₹{subscriptions.amount}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {status === "active" ? (
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                  )}
                                  {status === "active" ? "Active" : "Expired"}
                                </span>
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
