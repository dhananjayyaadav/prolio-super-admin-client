import React, { useState } from "react";
import { Users } from "react-feather";
import DeclineCardModal from "./DeclineCardModal";

const ForumRequests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [isDeclineCardModalOpen, setIsDeclineCardModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // To store selected request

  const openModal = (request) => {
    setSelectedRequest(request); // Set the selected request
    setIsDeclineCardModalOpen(true);
  };

  const closeModal = () => {
    setIsDeclineCardModalOpen(false);
    setSelectedRequest(null); // Reset selected request
  };

  // Sample data for demonstration
  const requests = [
    {
      id: 1,
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque est.",
      createdBy: "surya",
      members: 1000,
    },
    {
      id: 1,
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque est.",
      createdBy: "surya",
      members: 1000,
    },
    {
      id: 1,
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque est.",
      createdBy: "surya",
      members: 1000,
    },
    {
      id: 1,
      name: "Forum Name",
      description:
        "About Forum est quos magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque est.",
      createdBy: "surya",
      members: 1000,
    },
    // Add more items as needed
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
        <h2 className="text-xl font-semibold">Forum Requests</h2>
      </div>
      <div className="bg-white p-4 shadow-md">
        <div className="flex justify-start space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "sent"
                ? "bg-blue-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "received"
                ? "bg-blue-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {activeTab === "received" &&
            requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-md p-4 shadow-sm flex flex-col justify-between bg-white"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white mr-2">
                    <Users size={20} />
                  </div>
                  <h3 className="font-semibold text-lg">{request.name}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {request.description}{" "}
                  <a href="#" className="text-gray-900">
                    Read More
                  </a>
                </p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-900">
                  <span>Created By: {request.createdBy}</span>
                  <span>Members: {request.members}</span>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <button
                    className="p-2 mr-3 border rounded-lg text-gray-900 hover:bg-gray-100"
                    onClick={() => openModal(request)}
                  >
                    Decline
                  </button>
                  <button className="py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          {isDeclineCardModalOpen && (
            <DeclineCardModal
              request={selectedRequest}
              closeModal={closeModal}
            />
          )}
          {activeTab === "sent" &&
            requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-md p-4 shadow-sm flex flex-col justify-between bg-white"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white mr-2">
                    <Users size={20} />
                  </div>
                  <h3 className="font-semibold text-lg">{request.name}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {request.description}{" "}
                  <a href="#" className="text-blue-600">
                    Read More
                  </a>
                </p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span>Created By: {request.createdBy}</span>
                  <span>Members: {request.members}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button className="py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-900">
                    Cancel Request
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Decline Card Modal */}
    </div>
  );
};

export default ForumRequests;
