import React, { useLayoutEffect, useState } from "react";
import { User, LogIn, UserPlus, ArrowRight, Zap, LogOut } from "lucide-react";
import { Link } from "react-router";
import Header from "../components/Header";
import Cookie from "js-cookie";
function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  useLayoutEffect(() => {
    const authtoken = Cookie.get("authtoken");
    if (authtoken) {
      setLoggedIn(true);
    }
  });
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                TechFlow
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Your gateway to innovative technology solutions and seamless
              digital experiences.
            </p>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto mb-16">
              {loggedIn ? (
                <>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:scale-105">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Profile
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Manage your account settings, preferences, and personal
                      information.
                    </p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                    >
                      Go to Profile
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:scale-105">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <LogOut className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Logout
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Join our community and unlock exclusive features and
                      benefits.
                    </p>
                    <button
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                      onClick={() => {
                        Cookie.remove("authtoken");
                      }}
                    >
                      LogOut
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:scale-105">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Login
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Access your existing account and continue your journey
                      with us.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                    >
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:scale-105">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Register
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Join our community and unlock exclusive features and
                      benefits.
                    </p>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Additional Info Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Choose your path and begin exploring everything TechFlow has to
                offer. Whether you're returning or just getting started, we're
                here to help you succeed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore Products
                </Link>
                <Link
                  to="/about"
                  className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose TechFlow?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Experience cutting-edge technology with user-friendly design and
              exceptional support.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
