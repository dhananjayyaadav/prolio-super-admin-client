import React, { useEffect, useState, useCallback } from "react";
import ReportDetailModal from "./ReportDetailModal";
import { Search, RefreshCcw, AlertTriangle, Filter } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import api from "../../../services/axios";

const ReportProduct = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const reasons = {
    all: "All Reasons",
    fake: "Fake Product",
    misleading: "Misleading Information",
    inappropriate: "Inappropriate Content",
    spam: "Spam",
  };

  const fetchReports = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await api.get(
        "/admin/report-product/get-all-products-reports"
      );
      setReports(response.data.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch reports";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleBlockProduct = async (productId, blockData) => {
    try {
      setIsBlocking(true);
      const requestData = {
        action: "block",
        reason: blockData.reason,
        reportId: blockData.reportId,
        status: "resolved",
      };

      const response = await api.patch(
        `/admin/report-product/block-product/${productId}`,
        requestData
      );

      if (response.data.success) {
        // Update the local reports state immediately
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === blockData.reportId
              ? { ...report, status: "resolved" }
              : report
          )
        );

        // Refresh the data from server
        await fetchReports(false);
        setSelectedReport(null);
        toast.success("Product blocked successfully");
      }
    } catch (err) {
      console.error("Block error:", err);
      toast.error(err.response?.data?.message || "Failed to block product");
    } finally {
      setIsBlocking(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    if (!report?.productId?.basicDetails || !report?.reportedBy) return false;

    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      report.productId.basicDetails.name
        ?.toLowerCase()
        .includes(searchTermLower) ||
      report.reportedBy.name?.toLowerCase().includes(searchTermLower);

    const matchesReason =
      filterReason === "all" || report.reason === filterReason;

    const matchesStatus =
      filterStatus === "all" ||
      report.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesReason && matchesStatus;
  });

  const StatusToggle = () => (
    <div className="flex space-x-2 bg-gray-100 rounded-full p-1">
      {["All", "Pending", "Resolved"].map((status) => (
        <button
          key={status}
          onClick={() => setFilterStatus(status.toLowerCase())}
          className={`flex-1 px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
            filterStatus === status.toLowerCase()
              ? "bg-blue-800 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600" />
      </div>
    );
  }

  if (error && !reports.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 p-4">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Reports
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchReports()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-poppins bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Product Reports
            </h1>
            <p className="text-gray-500">Manage and review product reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusToggle />
            <button
              onClick={() => fetchReports(false)}
              disabled={isRefreshing}
              className="p-2.5 bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCcw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(reasons).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-500 text-lg">
              No reports match your search criteria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <div
                key={report._id}
                className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden
                  ${
                    index % 3 === 0
                      ? "border-blue-100"
                      : index % 3 === 1
                      ? "border-purple-100"
                      : "border-pink-100"
                  }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          report.productId.images[0]?.url ||
                          "/placeholder-image.jpg"
                        }
                        alt={report.productId.basicDetails.name}
                        className="w-16 h-16 object-cover rounded-lg ring-2 ring-gray-200"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                        ${
                          report.status === "pending"
                            ? "bg-yellow-400"
                            : report.status === "reviewing"
                            ? "bg-blue-400"
                            : "bg-green-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {report.productId.basicDetails.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reported by: {report.reportedBy.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase
                    ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "reviewing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onBlockProduct={(productId, blockData) =>
            handleBlockProduct(productId, blockData)
          }
          isBlocking={isBlocking}
        />
      )}
    </div>
  );
};

export default ReportProduct;
