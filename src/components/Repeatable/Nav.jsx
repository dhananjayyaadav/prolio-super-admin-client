// Nav.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  UserCircle,
  LogOut,
  BellRing,
  Home,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const username = "Admin";

  const notifications = [
    {
      id: 1,
      message: "New user registration",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "System update completed",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 3,
      message: "New feature available",
      time: "2 hours ago",
      unread: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await api
      .delete(`/admin/auth/logout`)
      .then((res) => {
        navigate("/login");
        dispatch({ type: "logout" });
        setLoggingOut(false);
      })
      .catch((error) => {
        setLoggingOut(false);
        dispatch({ type: "logout" });
        toast.error(error.response.data.error);
      });

    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-blue-900" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prolio
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-800 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Notification Icon */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-full hover:bg-blue-800 transition-colors focus:outline-none"
              >
                <BellRing className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50">
                  <h3 className="px-4 py-2 text-lg font-semibold text-gray-900 border-b">
                    Notifications
                  </h3>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          {notification.unread && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-4 py-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{username}</span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                  <div className="py-1" role="menu">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                      role="menuitem"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-sm font-medium">
              <div className="flex items-center space-x-3 mb-4">
                <UserCircle className="h-5 w-5" />
                <span>{username}</span>
              </div>
              <button
                onClick={handleProfile}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full text-left px-3 py-2 rounded-md text-red-300 hover:bg-blue-700"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
