import React, { useEffect, useState } from "react";
import { Users, Search, ToggleLeft, ToggleRight } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 9;

const ForumManagement = () => {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [expandedForumId, setExpandedForumId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    const filtered = Array.isArray(forums)
      ? forums.filter(
          (forum) =>
            forum.forumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            forum.forumDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            forum.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
    setFilteredForums(filtered);
    setCurrentPage(1);
  }, [searchTerm, forums]);
  const fetchForums = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/forum/getAll-forums`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data.forums)) {
        setForums(response.data.forums);
        setFilteredForums(response.data.forums);
      } else {
        throw new Error("Forums data is not an array");
      }
    } catch (error) {
      console.error("Error fetching forums:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch forums.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForumStatus = async (forumId, currentStatus) => {
    const statusMessage = !currentStatus ? "activate" : "deactivate";
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to ${statusMessage} this forum?`,
        text: `This will ${statusMessage} the forum and change its visibility.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${statusMessage} it!`,
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      if (result.isConfirmed) {
        await axios.patch(
          `${BASE_URL}/forum/toggle-active/${forumId}`,
          { forumId, status: !currentStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForums(
          forums.map((forum) =>
            forum._id === forumId
              ? { ...forum, isActive: !currentStatus }
              : forum
          )
        );
        Swal.fire({
          title: "Success!",
          text: `Forum ${statusMessage}d successfully.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "The forum status was not changed.",
          icon: "info",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error toggling forum status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update forum status.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const toggleDescription = (forumId) => {
    setExpandedForumId((prevId) => (prevId === forumId ? null : forumId));
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };
  const totalPages = Math.ceil(filteredForums.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentForums = filteredForums.slice(startIndex, endIndex);
  const renderPagination = () => {
    return (
      <nav
        className="flex justify-center mt-6 gap-2"
        aria-label="Forum pagination"
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-900 text-white hover:bg-blue-800"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-900 hover:bg-blue-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-900 text-white hover:bg-blue-800"
          }`}
        >
          Next
        </button>
      </nav>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-blue-900 text-white py-4 px-4 rounded-t-md flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Forums</h2>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>
      </div>

      <div className="bg-white p-4 shadow-md">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : currentForums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {currentForums.map((forum) => (
              <div
                key={forum._id}
                className={`border rounded-md p-4 shadow-sm flex flex-col justify-between ${
                  !forum.isActive ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white mr-2">
                      {forum.forumImage ? (
                        <img
                          src={forum.forumImage}
                          alt={`${forum.forumName} logo`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Users size={20} className="text-white" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{forum.forumName}</h3>
                  </div>
                  <button
                    onClick={() => toggleForumStatus(forum._id, forum.isActive)}
                    className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium"
                    title={
                      forum.isActive ? "Deactivate Forum" : "Activate Forum"
                    }
                  >
                    {forum.isActive ? (
                      <ToggleRight className="text-green-600 h-8 w-10" />
                    ) : (
                      <ToggleLeft className="text-gray-400 h-8 w-10" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {expandedForumId === forum._id
                    ? forum.forumDescription
                    : truncateDescription(forum.forumDescription)}
                  {forum.forumDescription.length > 100 && (
                    <button
                      onClick={() => toggleDescription(forum._id)}
                      className="ml-1 text-blue-600 hover:underline focus:outline-none"
                    >
                      {expandedForumId === forum._id
                        ? "Read Less"
                        : "Read More"}
                    </button>
                  )}
                </p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span className="text-sm text-black font-medium bg-gray-100 px-2 py-1 rounded">
                    Created By:{" "}
                    {forum.userId
                      ? `${forum.userId.firstName} ${forum.userId.lastName}`
                      : "No owner"}
                  </span>

                  <span className="text-sm text-black font-medium bg-gray-100 px-2 py-1 rounded">
                    Members: {forum.members?.length || 0}
                  </span>
                </div>

                <div className="text-sm text-black font-medium  px-2 py-1 rounded mt-1">
                  Company: {forum.companyId?.companyName || "No company"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No forums found...
          </div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
};

export default ForumManagement;
