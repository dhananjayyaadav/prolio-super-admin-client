// InfluencerPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import api from "../../../services/axios";
import Pagination from "../../../utils/Pagination";
import VerificationDetails from "./VerificationDetails";

const MySwal = withReactContent(Swal);

const StatusBadge = ({ status }) => {
  const badgeStyles = {
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels = {
    verified: "Verified",
    rejected: "Rejected",
    pending: "Pending",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        badgeStyles[status] || badgeStyles.pending
      }`}
    >
      {statusLabels[status] || statusLabels.pending}
    </span>
  );
};

const BadgeVerificationPage = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [influencers, setInfluencers] = useState([]);
  const [influencerCounts, setInfluencerCounts] = useState({
    verified: 0,
    pending: 0,
    rejected: 0,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

  const tabs = [
    {
      id: "verified",
      label: "Verified",
      icon: CheckCircle,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: XCircle,
    },
  ];

  const fetchInfluencerCounts = async () => {
    try {
      const response = await api.get("/admin/influencers/badges-applications");
      if (response.data.success) {
        const counts = {
          verified: response.data.influencers.filter(
            (inf) => inf.isInfluencer?.badgeStatus?.verified
          ).length,
          rejected: response.data.influencers.filter(
            (inf) => inf.isInfluencer?.badgeStatus?.rejected
          ).length,
          pending: response.data.influencers.filter(
            (inf) =>
              !inf.isInfluencer?.badgeStatus?.verified &&
              !inf.isInfluencer?.badgeStatus?.rejected
          ).length,
        };
        setInfluencerCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching influencer counts:", error);
    }
  };

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/influencers/badges-applications");

      if (response.data.success) {
        let filteredInfluencers = response.data.influencers;

        // Filter based on activeTab
        switch (activeTab) {
          case "verified":
            filteredInfluencers = filteredInfluencers.filter(
              (inf) => inf.isInfluencer?.badgeStatus?.verified
            );
            break;
          case "rejected":
            filteredInfluencers = filteredInfluencers.filter(
              (inf) => inf.isInfluencer?.badgeStatus?.rejected
            );
            break;
          case "pending":
            filteredInfluencers = filteredInfluencers.filter(
              (inf) =>
                !inf.isInfluencer?.badgeStatus?.verified &&
                !inf.isInfluencer?.badgeStatus?.rejected
            );
            break;
          default:
            break;
        }

        setInfluencers(filteredInfluencers);

        // Update pagination
        const totalItems = filteredInfluencers.length;
        const totalPages = Math.ceil(totalItems / pagination.perPage);
        setPagination((prev) => ({
          ...prev,
          totalPages,
          totalItems,
        }));
      }
    } catch (error) {
      console.error("Error fetching influencers:", error);
      toast.error("Failed to fetch influencers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfluencers();
    fetchInfluencerCounts();
  }, [activeTab, pagination.currentPage]);

  const filteredInfluencers = useMemo(() => {
    return influencers.filter(
      (influencer) =>
        influencer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [influencers, searchQuery]);

  // Frontend: handleUpdateStatus function
  const handleUpdateStatus = async (influencerId, isVerified) => {
    try {
      const action = isVerified ? "verified" : "rejected";
      let rejectedReason = "";

      // If rejected, prompt for rejection reason
      if (action === "rejected") {
        const result = await MySwal.fire({
          title: "Rejection Reason",
          text: "Please provide a reason for rejecting this influencer:",
          input: "textarea",
          inputPlaceholder: "Enter reason...",
          showCancelButton: true,
          confirmButtonText: "Submit",
          cancelButtonText: "Cancel",
          preConfirm: (inputValue) => {
            if (!inputValue) {
              MySwal.showValidationMessage("Please enter a rejection reason");
              return false;
            }
            return inputValue;
          },
        });

        if (!result.isConfirmed) {
          return;
        }
        rejectedReason = result.value;
      }

      // Confirm action
      const confirmation = await MySwal.fire({
        title: "Are you sure?",
        text: `Do you want to mark this influencer as ${action}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update status!",
        cancelButtonText: "No, cancel",
      });

      if (confirmation.isConfirmed) {
        // Prepare the request body to match backend expectations
        const requestBody = {
          action,
          rejectedReason: action === "rejected" ? rejectedReason : null,
        };

        // Make the API request
        const response = await api.patch(
          `/admin/influencers/updateBadges-status/${influencerId}`,
          requestBody
        );

        if (response.data.success) {
          await MySwal.fire({
            title: "Success!",
            text: `Influencer successfully ${action}.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setSelectedInfluencer(null);
          setIsModalOpen(false);
          await fetchInfluencers();
          await fetchInfluencerCounts();
        } else {
          MySwal.fire({
            title: "Error!",
            text:
              response.data.message || "Failed to update influencer status.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Error updating influencer status:", error);
      MySwal.fire({
        title: "Error!",
        text: "Something went wrong while updating influencer status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="container mx-auto bg-gray-50 max-h-screen">
      <div className="container mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">
            Influencer Badges Verification
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="pl-10 pr-4 py-2 w-64 rounded-full border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Search className="absolute left-3 top-3 text-blue-400" />
          </div>
        </div>

        {/* Tabs with Counts */}
        <div className="flex border-b bg-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all relative ${
                activeTab === tab.id
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-blue-700"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              {influencerCounts[tab.id] > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold 
    ${
      tab.id === "pending"
        ? "bg-red-500 text-white animate-pulse" // Changed to red background
        : tab.id === "verified"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
                >
                  {influencerCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Influencers Table */}
        <div className="p-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredInfluencers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No influencers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    {[
                      "Personal Info",
                      "Contact Details",
                      "Badge Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInfluencers.map((influencer) => (
                    <tr
                      key={influencer._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-4">
                          {influencer.profile?.url ? (
                            <img
                              src={influencer.profile.url}
                              alt="Influencer Profile"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No Photo
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">
                              {influencer.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {influencer.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          <div>{influencer.phone || "N/A"}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <StatusBadge
                          status={
                            influencer.isInfluencer?.badgeStatus?.verified
                              ? "verified"
                              : influencer.isInfluencer?.badgeStatus?.rejected
                              ? "rejected"
                              : "pending"
                          }
                        />
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedInfluencer(influencer);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, currentPage: page }))
            }
            loading={loading}
          />
        </div>
      </div>

      {/* Influencer Detail Modal */}
      {/* Influencer Detail Modal */}
      <VerificationDetails
        influencer={selectedInfluencer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default BadgeVerificationPage;
