import React from "react";
import { Users, Menu, Home, MessageSquare, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      {/* Profile section */}
      <div className="flex items-center p-4 border-b">
        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white">
          <Users size={20} />
        </div>
        <span className="ml-2 text-lg font-semibold">Suyra Suri</span>
        <button className="ml-auto text-gray-600">
          <Menu size={20} />
        </button>
      </div>

      {/* Add Forum Button */}
      <button className="w-full py-2 px-4 mt-4 bg-blue-800 text-white rounded flex items-center justify-center">
        <span className="mr-2">+</span> Add Forum
      </button>

      {/* Navigation */}
      <nav className="mt-6 space-y-2">
        <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
          <Users size={20} className="mr-2" /> Group
        </button>
        <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
          <Users size={20} className="mr-2" /> Members1
        </button>
        <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
          <Users size={20} className="mr-2" /> Members2
        </button>
      </nav>
    </div>
  );
};

const ForumManagement = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Add Forum</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto"
              width="200"
              height="120"
              viewBox="0 0 200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="60" r="40" fill="#E5E7EB" />
              <circle cx="60" cy="40" r="15" fill="#1E40AF" />
              <circle cx="140" cy="40" r="15" fill="#1E40AF" />
              <circle cx="80" cy="80" r="15" fill="#1E40AF" />
              <circle cx="120" cy="80" r="15" fill="#1E40AF" />
              <path
                d="M70 100 L90 120 L110 120 L130 100"
                stroke="#1E40AF"
                strokeWidth="4"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">
            Prolio fosters seamless communication and collaboration
            <br />
            among vendors, enabling real-time updates and efficient project
            coordination.
          </p>
          <button className="bg-blue-800 text-white py-2 px-4 rounded">
            Create Forum
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumManagement;
