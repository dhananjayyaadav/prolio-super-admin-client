import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreVertical,
  X,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter,
} from "lucide-react";
import api from "../../../services/axios";
import CompanyDetailModal from "./CompanyDetailModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import Pagination from "../../../utils/Pagination";

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

const CompanyProfiles = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Set fixed page size to 3
  const pageSize = 3;

  const [companyCounts, setCompanyCounts] = useState({
    verified: 0,
    unVerified: 0,
    rejected: 0,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const tabs = [
    {
      id: "verified",
      label: "Verified",
      icon: CheckCircle,
    },
    {
      id: "un-verified",
      label: "Pending",
      icon: Clock,
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: XCircle,
    },
  ];
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Use the fixed page size of 3
      const endpoint = `/admin/company/${activeTab}?page=${pagination.currentPage}&pageSize=${pageSize}&search=${searchQuery}`;
      const response = await api.get(endpoint);
      const data = response.data;

      if (data.success) {
        setCompanies(data.data);

        // Fetch counts for all tabs
        const countsResponse = await Promise.all([
          api.get("/admin/company/verified?countOnly=true"),
          api.get("/admin/company/un-verified?countOnly=true"),
          api.get("/admin/company/rejected?countOnly=true"),
        ]);

        setCompanyCounts({
          verified: countsResponse[0].data?.count || 0,
          unVerified: countsResponse[1].data?.count || 0,
          rejected: countsResponse[2].data?.count || 0,
        });

        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPrevPage: data.hasPrevPage,
        });
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [activeTab, pagination.currentPage, searchQuery]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.companyDetails?.companyInfo?.companyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        company.companyDetails?.companyInfo?.ownerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  const handleUpdateStatus = async (companyId, status) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: `Do you really want to change the status to "${status}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        await api.put(`/admin/company/change-status/${companyId}`, { status });

        await MySwal.fire({
          title: "Success!",
          text: `Company status updated to "${status}" successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchCompanies(); // Refresh the list after update
      }
    } catch (error) {
      console.error("Error updating company status:", error);
      toast.error("Failed to update company status");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [activeTab, pagination.currentPage, searchQuery]);

  return (
    <div className="container mx-auto bg-gray-50 max-h-screen">
      <div className="container mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Company Profiles...</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
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
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              companyCounts[tab.id === "un-verified" ? "unVerified" : tab.id];

            return (
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
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-bold 
                    ${
                      tab.id === "un-verified"
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Companies Table */}
        <div className="p-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No companies found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    {[
                      "Company Info",
                      "Registered Contact",
                      "Company Contact",
                      // "Business Details",
                      "Status",
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
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-4">
                          {company.companyDetails?.companyLogo?.url ? (
                            <img
                              src={company.companyDetails.companyLogo.url}
                              alt="Company Logo"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No Logo
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">
                              {company.companyDetails?.companyInfo
                                ?.companyName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Owner:{" "}
                              {company.companyDetails?.companyInfo?.ownerName ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {/* <div className="font-medium">Registered Email:</div> */}
                          <div>{company.email || "N/A"}</div>
                          {/* <div className="font-medium mt-1">
                            Registered Phone:
                          </div> */}
                          <div>{company.phone || "N/A"}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {/* <div className="font-medium">Company Email:</div> */}
                          <div>
                            {company.companyDetails?.contactInfo?.email ||
                              "N/A"}
                          </div>
                          {/* <div className="font-medium mt-1">Company Phone:</div> */}
                          <div>
                            {company.companyDetails?.contactInfo?.phone ||
                              "N/A"}
                          </div>
                          {/* <div className="text-xs text-gray-500 mt-1">
                            {[
                              company.companyDetails?.contactInfo?.address,
                              company.companyDetails?.contactInfo?.city,
                              company.companyDetails?.contactInfo?.state,
                              company.companyDetails?.contactInfo?.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Address not provided"}
                          </div> */}
                        </div>
                      </td>
                      {/* <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          <div>
                            GST:{" "}
                            {company.companyDetails?.companyInfo?.gstNo ||
                              "N/A"}
                          </div>
                          <div>
                            Type:{" "}
                            {company.companyDetails?.companyInfo
                              ?.businessType || "N/A"}
                          </div>
                          <div>
                            Employees:{" "}
                            {company.companyDetails?.companyInfo
                              ?.totalEmployees || "N/A"}
                          </div>
                        </div>
                      </td> */}

                      <td className="py-3 px-4 text-sm">
                        {company.isCompany.verified && (
                          <span className="text-green-600">Verified: </span>
                        )}
                        {company.isCompany.rejected && (
                          <span className="text-red-600">Rejected: </span>
                        )}
                        {!company.isCompany.verified &&
                          !company.isCompany.rejected && (
                            <span className="text-yellow-600">Pending</span>
                          )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
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

      {/* Company Detail Modal */}
      <CompanyDetailModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default CompanyProfiles;
