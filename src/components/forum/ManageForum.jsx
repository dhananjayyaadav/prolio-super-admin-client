import React from "react";
import { Search, ChevronLeft, MoreVertical } from "lucide-react";

const ManageForum = () => {
  const forumData = [
    {
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque esta.",
      createdBy: "surya",
      members: 1000,
    },
    {
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque esta.",
      createdBy: "surya",
      members: 1000,
    },
    {
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque esta.",
      createdBy: "surya",
      members: 1000,
    },
    {
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque esta.",
      createdBy: "surya",
      members: 1000,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Forum Management</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Forum Management</h2>
              <div className="flex space-x-2">
                <Search className="w-5 h-5 text-gray-500" />
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <span className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                  ☰
                </span>
                <span>Manage Products of Forums</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <span className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                  💬
                </span>
                <span>My Forums</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <span className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                  🔍
                </span>
                <span>Explore</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-600 font-semibold">
                <span className="w-5 h-5 border border-blue-600 rounded-full flex items-center justify-center">
                  ✉️
                </span>
                <span>Invitations</span>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-600">
                  Form requests
                </h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-8 pr-2 py-1 border border-gray-300 rounded-md"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <button className="text-gray-500 border-b-2 border-transparent hover:border-blue-600">
                Sent
              </button>
              <button className="text-blue-600 border-b-2 border-blue-600">
                Received
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forumData.map((forum, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-2">{forum.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {forum.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Created By: {forum.createdBy}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Members: {forum.members}
                    </span>
                    <div className="space-x-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                        Decline
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageForum;
