import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Zap,
  UserCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { useLocation, Link } from "react-router";
import Cookie from "js-cookie";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [{ name: "Home", path: "/" }];

  const cookieValue = Cookie.get("authtoken");
  const isAuthenticated = !!cookieValue;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileDropdownOpen(false);
    };
    if (isProfileDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  return (
    <header
      className={`bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg shadow-gray-200/50" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
          >
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              TechFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive(link.path)
                    ? "text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                    isActive(link.path) ? "w-6" : "w-0 group-hover:w-6"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth & Cart */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                >
                  <UserCircle className="h-6 w-6" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/checkout"
              className="relative p-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                3
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-xl transition-all duration-300 hover:bg-gray-50"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-180"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-180"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="border-t border-gray-100 pt-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-100 mt-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5 mr-3" />
                      Profile
                    </Link>
                    <button className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300">
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="mx-4 my-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl text-base font-medium text-center transition-all duration-300 shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}

                <Link
                  to="/checkout"
                  className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Checkout
                  <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                    3
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
