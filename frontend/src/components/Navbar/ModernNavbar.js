import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn, FiHome, FiGrid, FiPlusCircle, FiShield } from "react-icons/fi";

const ModernNavbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Campaigns", path: "/campaigns", icon: <FiGrid /> },
    { name: "Create", path: "/create-campaign", requiresAuth: true, icon: <FiPlusCircle /> },
    // Removed Admin link from here as it's already in the auth section
  ];

  // Debug user role for admin menu
  console.log('Navbar - currentUser:', currentUser);
  console.log('Navbar - user role:', currentUser?.role);
  console.log('Navbar - isAuthenticated:', isAuthenticated);

  // Filter nav items based on authentication status and role
  const filteredNavItems = navItems.filter(
    (item) =>
      (!item.requiresAuth && !item.requiresAdmin) ||
      (item.requiresAuth && isAuthenticated && !item.requiresAdmin) ||
      (item.requiresAdmin && isAuthenticated && currentUser?.role === 'admin')
  );

  // Debug filtered nav items
  console.log('Navbar - filteredNavItems:', filteredNavItems);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white shadow-sm py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              TrueFunding
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Nav Links */}
            <div className="flex">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`px-4 py-2 mx-1 text-sm font-medium rounded-md transition-colors duration-200 flex items-center ${
                    location.pathname === item.path
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 mx-1 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 mx-1 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 mx-1 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                  >
                    <FiUser className="mr-1.5" />
                    {currentUser?.username || "Profile"}
                  </Link>

                  {/* Admin Dashboard Link - Only visible for admins */}
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 mx-1 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-100 transition-colors duration-200 flex items-center"
                    >
                      <FiShield className="mr-1.5" />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="px-4 py-2 mx-1 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                  >
                    <FiLogOut className="mr-1.5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-md"
          >
            <div className="container mx-auto px-4 py-3">
              {/* Nav Links */}
              <div className="flex flex-col">
                {filteredNavItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 flex items-center ${
                      location.pathname === item.path
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                {!isAuthenticated ? (
                  <div className="flex flex-col">
                    <Link
                      to="/login"
                      className="px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <FiLogIn className="mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 mt-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors duration-200 flex items-center"
                    >
                      <FiUser className="mr-2" />
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link
                      to="/profile"
                      className="px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <FiUser className="mr-2" />
                      {currentUser?.username || "Profile"}
                    </Link>

                    {/* Admin Dashboard Link - Only visible for admins */}
                    {currentUser?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="px-4 py-3 text-sm font-medium rounded-md text-purple-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                      >
                        <FiShield className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="px-4 py-3 mt-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ModernNavbar;
