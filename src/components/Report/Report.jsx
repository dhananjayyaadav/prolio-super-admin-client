import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flag,
  Search,
  Filter,
  ChevronDown,
  Eye,
  FileText,
  Calendar,
  User,
  Package,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProductReportsAdmin = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterReason, setFilterReason] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a ref for the intersection observer
  const observer = useRef();
  const navigate = useNavigate();

  // Create a ref for the last report element
  const lastReportElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const reasons = {
    inappropriate: "Inappropriate Content",
    fake: "Fake Product",
    misleading: "Misleading Information",
    spam: "Spam",
    other: "Other",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const ITEMS_PER_PAGE = 20;

  // Modified fetch function to handle pagination
  const fetchReports = async (pageNum = 1, isNewSearch = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/productReport/getAllReports`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: pageNum,
            limit: ITEMS_PER_PAGE,
            reason: filterReason !== "all" ? filterReason : undefined,
            search: searchTerm || undefined,
            excludeBlocked: true, // Add parameter to exclude blocked products
          },
        }
      );

      const newReports = response.data.data.filter(
        (report) => report.productId && report.productId.status !== "block"
      );

      setHasMore(newReports.length === ITEMS_PER_PAGE);

      if (isNewSearch) {
        setReports(newReports);
      } else {
        setReports((prev) => [...prev, ...newReports]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for initial load and filter/search changes
  useEffect(() => {
    setPage(1);
    setReports([]);
    fetchReports(1, true);
  }, [filterReason, searchTerm]);

  // Effect for pagination
  useEffect(() => {
    if (page > 1) {
      fetchReports(page);
    }
  }, [page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Debounce search input
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const getMRPValue = (questions) => {
    try {
      // Navigate to the Pricing step (id: 2)
      const pricingStep = questions.steps.find((step) => step.id === 2);
      if (!pricingStep) return undefined;

      // Find the Pricing question (id: 1)
      const pricingQuestion = pricingStep.questions.find((q) => q.id === 1);
      if (!pricingQuestion) return undefined;

      // Find the MRP card (id: 5) within the cards array
      const mrpCard = pricingQuestion.cards.find((card) => card.id === 5);
      if (!mrpCard) return undefined;

      // Get the MRP value and convert it to a number
      const mrpValue = parseFloat(mrpCard.value);
      return isNaN(mrpValue) ? undefined : mrpValue;
    } catch (error) {
      console.error("Error getting MRP value:", error);
      return undefined;
    }
  };

  const getProductPrice = (questions) => {
    const mrp = getMRPValue(questions);
    return mrp;
  };

  const getProductName = (questions) => {
    try {
      // Navigate to the Product Details step (id: 1)
      const productDetailsStep = questions.steps.find((step) => step.id === 1);
      if (!productDetailsStep) return undefined;

      // Find the Product Name question (id: 1)
      const productNameQuestion = productDetailsStep.questions.find(
        (q) => q.id === 1
      );
      if (!productNameQuestion) return undefined;

      // Return the product name value
      return productNameQuestion.value || "N/A";
    } catch (error) {
      console.error("Error getting product name:", error);
      return "N/A";
    }
  };

  const getProductImageUrl = (questions) => {
    try {
      // Navigate to the Product Details step (id: 1)
      const productDetailsStep = questions.steps.find((step) => step.id === 1);
      if (!productDetailsStep) return undefined;

      // Find the Product Image question (id: 9)
      const productImageQuestion = productDetailsStep.questions.find(
        (q) => q.id === 9
      );
      if (!productImageQuestion) return undefined;

      // Get the first image URL from the images array
      const firstImage = productImageQuestion.images?.[0]?.url;
      return firstImage || "/placeholder.png";
    } catch (error) {
      console.error("Error getting product image URL:", error);
      return "/placeholder.png";
    }
  };

  const updateProductStatus = async ({ params, body }) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update product status
      const productResponse = await fetch(
        `${apiURL}/product/update-product/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!productResponse.ok) {
        throw new Error("Failed to update product status");
      }

      // Update all related reports status to resolved
      const reportResponse = await fetch(
        `${apiURL}/productReport/updateReportsByProduct/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "resolved" }),
        }
      );

      if (!reportResponse.ok) {
        throw new Error("Failed to update report status");
      }

      return {
        status: productResponse.status,
        data: await productResponse.json(),
      };
    } catch (error) {
      console.error("Update status error:", error);
      throw error;
    }
  };

  const handleBlockProduct = async (onProductBlocked) => {
    setIsLoading(true);
    setError(null);

    try {
      const productId =
        selectedReport?.productId?._id || selectedReport?.productId;

      if (!productId) {
        throw new Error("Product ID not found");
      }

      // Show confirmation dialog
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to block this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, block it!",
      });

      if (confirmResult.isConfirmed) {
        console.log("Attempting to block product with ID:", productId);

        // Proceed to block the product
        const result = await updateProductStatus({
          params: { id: productId },
          body: { status: "block" },
        });

        // Log the entire response for debugging
        console.log("API response result:", JSON.stringify(result, null, 2));

        // Check if the response indicates success
        if (
          result?.status === 200 &&
          result?.message === "Product updated successfully"
        ) {
          // Remove all reports for this product from the current state
          setReports((prevReports) =>
            prevReports.filter(
              (report) =>
                (report.productId?._id || report.productId) !== productId
            )
          );
          setIsDetailModalOpen(false);
          setSelectedReport(null);
          if (onProductBlocked) {
            onProductBlocked(productId);
          }
          setPage(1);
          fetchReports(1, true);
          Swal.fire(
            "Blocked!",
            "The product has been successfully blocked.",
            "success"
          );
        } else {
          console.error("Unexpected API response:", result);
          throw new Error(result?.error || "Failed to update report status");
        }
      }
    } catch (error) {
      setError(error.message || "Failed to block product. Please try again.");
      console.error("Error in handleBlockProduct:", error);

      Swal.fire(
        "Error",
        error.message || "Failed to block product. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    const productId = report?.productId?._id || report?.productId;
    navigate(`/admin/product/${productId}`);
  };

  const ReportDetailModal = ({ report, onClose, onProductBlocked }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Report Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4">
          {/* Report Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Report Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reported Date</p>
                  <p className="font-medium">
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reported By</p>
                  <p className="font-medium">{report.userId.name}</p>
                  <p className="text-sm text-gray-500">{report.userId.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Report Reason</p>
                  <p className="font-medium">
                    {
                      {
                        inappropriate: "Inappropriate Content",
                        fake: "Fake Product",
                        misleading: "Misleading Information",
                        spam: "Spam",
                        other: "Other",
                      }[report.reason]
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded-full ${
                      {
                        pending: "bg-yellow-100 text-yellow-800",
                        reviewing: "bg-blue-100 text-blue-800",
                        resolved: "bg-green-100 text-green-800",
                        rejected: "bg-red-100 text-red-800",
                      }[report.status || "pending"]
                    }`}
                  >
                    {report.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={getProductImageUrl(report.productId.questions)}
                  alt={getProductName(report.productId.questions)}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold">
                    Product Name:{" "}
                    <span className="font-semibold">
                      {getProductName(report.productId.questions)}
                    </span>
                  </h4>

                  <p className="text-lg font-semibold text-gray-800">
                    Price:{" "}
                    <span className="text-green-600">
                      {getProductPrice(report.productId.questions) !== undefined
                        ? `₹${getProductPrice(
                            report.productId.questions
                          ).toFixed(2)}`
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Description */}
          <div className="border-t pt-2">
            {/* Description Section */}
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Report Description
            </h4>
            <p className="text-gray-600 whitespace-pre-wrap mb-4">
              {report.description}
            </p>

            {/* Attachments Section */}
            {report.attachments && report.attachments.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Attachments
                </h5>
                <div className="space-y-3">
                  {report.attachments.map((attachment, index) => (
                    <div
                      key={attachment._id || index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* Anchor tag to open image in a new tab */}
                      <a
                        href={attachment.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* File Preview/Thumbnail */}
                        <div className="h-16 w-16 flex items-center justify-center overflow-hidden cursor-pointer">
                          <img
                            src={attachment.filePath}
                            alt={attachment.fileName}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </div>
                      </a>

                      {/* File Details */}
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.fileType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <a
              href={`/admin/product/${
                report?.productId?._id || report?.productId
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white font-medium inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            >
              View Product
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header remains the same */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Product Reports</h1>
          <p className="text-gray-500">Manage and review product reports</p>
        </div>
      </div>
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by product, reporter, or description..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
          >
            <option value="all">All Reasons</option>
            {Object.entries(reasons).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report, index) => (
              <tr
                key={report._id}
                ref={index === reports.length - 1 ? lastReportElementRef : null}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(report.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex items-center justify-center mb-2 overflow-hidden">
                      <img
                        src={getProductImageUrl(report.productId.questions)}
                        alt={getProductName(report.productId.questions)}
                        className="w-full h-full rounded-lg object-contain"
                      />
                    </div>

                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {report.productId.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {report.userId.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {report.userId.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {reasons[report.reason]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[report.status || "pending"]
                    }`}
                  >
                    {report.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-blue-00 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          //   productId={productId}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
          }}
          onProductBlocked={(productId) => {
            // You might want to refresh the reports list or update the UI
            setReports(
              reports.filter(
                (report) =>
                  report.productId._id !== productId &&
                  report.productId !== productId
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductReportsAdmin;
