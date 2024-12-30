import React, { useState } from "react";
import Swal from "sweetalert2";
import { Flag, Calendar, User, X, Shield, FileText, Eye } from "lucide-react";

const ReportDetailModal = ({ report, onClose, onBlockProduct, isBlocking }) => {
  if (!report) return null;
  const getStatusColor = () => {
    switch (report.status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // Ensure safe image and data access with optional chaining
  const productImage = report.productId?.images?.[0]?.url || "/placeholder.png";
  const productName = report.productId?.basicDetails?.name || "Unnamed Product";
  const productPrice =
    report.productId?.basicDetails?.price?.toFixed(2) || "0.00";
  const reporterName = report.reportedBy?.name || "Anonymous";
  const reporterEmail = report.reportedBy?.email || "N/A";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* <AlertTriangle className="w-6 h-6 text-red-500" /> */}
            <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Product Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center space-x-5">
            <div className="relative">
              <img
                src={productImage}
                alt={productName}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                Reported
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {productName}
              </h3>
              <p className="text-green-600 font-bold text-xl mb-2">
                ₹ {productPrice}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
              >
                {report.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          {/* Reporter and Report Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Reporter Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">{reporterName}</p>
                    <p className="text-sm text-gray-500">{reporterEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "No date available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Report Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-medium capitalize text-gray-700">
                    {report.reason || "No reason specified"}
                  </p>
                </div>
                {report.attachments && report.attachments.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                      Attachments
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      {report.attachments.map((attachment, index) => {
                        const isPDF =
                          attachment.fileType === "application/pdf" ||
                          attachment.fileName?.toLowerCase().endsWith(".pdf");

                        return (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group relative"
                          >
                            {isPDF ? (
                              <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                                <div className="flex flex-col items-center">
                                  <FileText className="w-8 h-8 text-red-500" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[90%] truncate">
                                    {attachment.fileName || "PDF Document"}
                                  </span>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-all">
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group">
                                <img
                                  src={attachment.url}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg group-hover:opacity-90 transition-all"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all">
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-4 h-4 text-white drop-shadow-lg" />
                                  </div>
                                </div>
                                <span className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  View
                                </span>
                              </div>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </h4>
            <div className="bg-gray-50 rounded-lg p-5">
              <p className="text-gray-700 leading-relaxed">
                {report.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        {/* Modal Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isBlocking}
              className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium
        ${isBlocking ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
              Dismiss
            </button>
            <button
              onClick={async () => {
                try {
                  const result = await Swal.fire({
                    title: "Block Product",
                    html: "Please provide a reason for blocking this product",
                    input: "textarea",
                    inputPlaceholder: "Enter reason here...",
                    inputAttributes: {
                      "aria-label": "Blocking reason",
                    },
                    showCancelButton: true,
                    confirmButtonColor: "#EF4444",
                    cancelButtonColor: "#6B7280",
                    confirmButtonText: "Block Product",
                    cancelButtonText: "Cancel",
                    showLoaderOnConfirm: true,
                    preConfirm: (reason) => {
                      if (!reason || !reason.trim()) {
                        Swal.showValidationMessage(
                          "Please provide a reason for blocking"
                        );
                        return false;
                      }
                      return reason;
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                  });

                  if (result.isConfirmed && report && report.productId) {
                    // Create blockData object with the correct structure
                    const blockData = {
                      reportId: report._id,
                      reason: result.value.trim(), // The actual reason text, not an ID
                    };

                    // Pass both productId and blockData to the handler
                    onBlockProduct(report.productId._id, {
                      reportId: report._id,
                      reason: result.value.trim(),
                    });
                  }
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to process the request",
                  });
                }
              }}
              disabled={isBlocking}
              className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
        transition-all duration-200 font-medium flex items-center space-x-2 
        ${isBlocking ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
            >
              <Shield className="w-4 h-4" />
              <span>{isBlocking ? "Blocking..." : "Block Product"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
