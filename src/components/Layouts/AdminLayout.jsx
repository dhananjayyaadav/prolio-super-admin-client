// AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "../Repeatable/Sidebar";
import Nav from "../Repeatable/Nav";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav Component */}
      <Nav />

      {/* Main Content Container with fixed top padding for navbar */}
      <div className="pt-16 flex min-h-screen">
        {/* Fixed Sidebar - Desktop */}
        <div
          className={`
            ${isSidebarOpen ? "w-64" : "w-20"} 
            hidden lg:block transition-all duration-300 ease-in-out
            bg-white shadow-lg fixed top-16 left-0 bottom-0
          `}
        >
          <div className="h-full overflow-y-auto">
            <Sidebar isCollapsed={!isSidebarOpen} />
          </div>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Sidebar - Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
              <div className="h-16 flex items-center justify-end px-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="p-4 sm:p-3">
            <div className="bg-white rounded-lg shadow-sm max-h-[calc(100vh-7rem)] p-1 sm:p-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
