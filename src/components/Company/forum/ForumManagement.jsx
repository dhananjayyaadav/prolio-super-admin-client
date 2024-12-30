import React, { useState, useEffect } from "react";
import { Users, Search, Trash2, Building } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const ForumManagement = () => {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [expandedForumId, setExpandedForumId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { companyId } = useParams();
  const location = useLocation();
  const { companyName } = location.state || {};

  console.log("Company Name from state:", companyName);

  const ITEMS_PER_PAGE = 10;

  const token = useSelector((state) => state.token);
  const MySwal = withReactContent(Swal);

  // Fetch Forums
  useEffect(() => {
    const fetchForums = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `admin/company-forum/all-CompanyForums/${companyId}`
        );

        const transformedForums = response.data.message.map((forum) => ({
          _id: forum._id,
          forumName: forum.forumName,
          forumDescription: forum.forumDescription || "No description provided",
          membersCount: forum.members?.length || 0,
          forumImage: forum.forumImage || null,
          isActive: !forum.isBlocked, // Derive active status from blocked status
          ownerName: forum.ownerId?.name || "N/A",
          objective: forum.objective || "",
          members: forum.members || [],
          pendingRequests: forum.pendingRequests || [],
          invitedUsers: forum.invitedUsers || [],
          isBlocked: forum.isBlocked,
        }));

        setForums(transformedForums);
        setFilteredForums(transformedForums);
        setError(null);
      } catch (error) {
        console.error("Error fetching forums:", error);
        setError("Failed to load forums. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [companyId]);

  // Toggle Active Status Function with Optimistic UI Update
  const handleToggleActive = async (forumId) => {
    // Find the current forum
    const currentForum = filteredForums.find((forum) => forum._id === forumId);

    // Create a copy of forums with the updated status (optimistic update)
    const updatedForums = filteredForums.map((forum) =>
      forum._id === forumId
        ? { ...forum, isActive: !forum.isActive } // Just toggle isActive optimistically
        : forum
    );

    // Optimistically update the UI with the new state
    setFilteredForums(updatedForums);
    setForums(updatedForums);

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Change Forum Status",
        text: `Are you sure you want to ${
          currentForum.isActive ? "block" : "unblock"
        } this forum?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (result.isConfirmed) {
        // Call API to toggle forum status
        const response = await api.patch(
          `admin/company-forum/toggle-block/${forumId}/toggle-block`
        );
        const updatedForum = response.data.message;

        // Update forums with the actual isBlocked status from the API
        const serverUpdatedForums = filteredForums.map((forum) =>
          forum._id === forumId
            ? {
                ...forum,
                isActive: !updatedForum.isBlocked,
                isBlocked: updatedForum.isBlocked,
              }
            : forum
        );

        // Update the state with the correct values
        setFilteredForums(serverUpdatedForums);
        setForums(serverUpdatedForums);

        // Show success message
        Swal.fire({
          title: "Success!",
          text: updatedForum.isBlocked
            ? "Forum has been blocked successfully"
            : "Forum has been unblocked successfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        // Revert changes if user cancels
        const revertedForums = filteredForums.map((forum) =>
          forum._id === forumId
            ? {
                ...forum,
                isActive: currentForum.isActive,
                isBlocked: currentForum.isBlocked,
              }
            : forum
        );

        setFilteredForums(revertedForums);
        setForums(revertedForums);
      }
    } catch (error) {
      // Handle error and revert to original sta
      console.error("Error toggling forum status:", error);
      toast.error("Failed to toggle forum status. Please try again.");
    }
  };

  // Search Handler
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = forums.filter(
      (forum) =>
        forum.forumName.toLowerCase().includes(term) ||
        forum.forumDescription.toLowerCase().includes(term)
    );

    setFilteredForums(filtered);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredForums.length);
  const currentForums = filteredForums.slice(startIndex, endIndex);

  // Toggle Description
  const toggleDescription = (forumId) => {
    setExpandedForumId((prevId) => (prevId === forumId ? null : forumId));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-1 sm:px-1 lg:px-4">
        {/* Header Section with Search */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <h2 className="text-xl font-semibold">
              Forum Management for {companyName}
            </h2>
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search forums..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 text-sm"
              />
              <Search
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-900 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600 text-sm">
            <p>{error}</p>
          </div>
        ) : currentForums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
            {currentForums.map((forum) => (
              <div
                key={forum._id}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Forum Header */}
                <div className="bg-blue-900 text-white p-4 relative overflow-hidden">
                  <div className="flex items-center space-x-3">
                    {/* Forum Image or Icon */}
                    <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center shadow-md">
                      {forum.forumImage ? (
                        <img
                          src={forum.forumImage}
                          alt={forum.forumName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Users className="text-blue-900" size={20} />
                      )}
                    </div>
                    {/* Forum Name */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-semibold truncate">
                        {forum.forumName}
                      </h2>
                      <p className="text-xs text-blue-100 opacity-90 truncate">
                        {forum.forumDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Forum Details */}
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600">
                          Owner: {forum.ownerName || "N/A"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Users size={12} className="mr-1" />
                          <span>{forum.membersCount || 0} members</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle active status */}
                    <Tippy
                      content={
                        forum.isBlocked
                          ? "This forum is currently blocked. Click to unblock."
                          : "This forum is active. Click to block it."
                      }
                      placement="top"
                    >
                      <button
                        onClick={() => handleToggleActive(forum._id)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1 ${
                          forum.isBlocked
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-400 active:scale-95"
                            : "bg-blue-800 text-white hover:bg-blue-900 active:scale-95"
                        }`}
                      >
                        {forum.isBlocked ? "Blocked" : "Active"}
                      </button>
                    </Tippy>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600">No forums available...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumManagement;
