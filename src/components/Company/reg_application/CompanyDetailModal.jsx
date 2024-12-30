import React from "react";
import {
  Building,
  Mail,
  Users,
  FileText,
  Calendar,
  MapPin,
  BarChart2,
  PhoneCall,
  Hash,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Link,
} from "lucide-react";

const CompanyDetailModal = ({ company, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !company) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
          badge: "bg-emerald-500 text-white",
          verifyButtonClass: "bg-gray-100 text-gray-400 cursor-not-allowed",
          rejectButtonClass:
            "bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50",
          statusText: "Verified",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
          badge: "bg-rose-500 text-white",
          verifyButtonClass:
            "bg-white border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50",
          rejectButtonClass: "bg-gray-100 text-gray-400 cursor-not-allowed",
          statusText: "Rejected",
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
          badge: "bg-amber-500 text-white",
          verifyButtonClass:
            "bg-white border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50",
          rejectButtonClass:
            "bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50",
          statusText: "Pending",
        };
    }
  };

  // Determine the status based on the API response
  const status = company.isCompany.verified
    ? "verified"
    : company.isCompany.rejected
    ? "rejected"
    : "pending";

  const statusConfig = getStatusConfig(status);

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5 text-indigo-400">{icon}</div>
      <div>
        <p className="text-[11px] text-gray-500 font-medium">{label}</p>
        <p className="text-xs text-gray-700 font-medium">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-700 to-blue-800 px-4 py-3 flex justify-between items-center z-10 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {company.companyDetails?.companyLogo?.url ? (
                <img
                  src={company.companyDetails.companyLogo.url}
                  alt="Logo"
                  className="w-9 h-9 object-cover rounded-lg ring-2 ring-white/30"
                />
              ) : (
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center ring-2 ring-white/30">
                  <Building className="w-4 h-4 text-white" />
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig.badge}`}
              >
                {statusConfig.statusText}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {company.companyDetails?.companyInfo?.companyName ||
                  "Company Details"}
              </h2>
              <p className="text-[12px] text-indigo-200">
                {company.companyDetails?.companyInfo?.businessType ||
                  "Business Type Not Specified"}{" "}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            {/* Company Logo */}
            <div className="relative group">
              {company.companyDetails?.companyLogo?.url ? (
                <img
                  src={company.companyDetails.companyLogo.url}
                  alt={`Logo of ${company.companyDetails?.companyInfo?.companyName}`}
                  className="h-72 w-72 object-cover rounded-2xl shadow-lg ring-1 ring-gray-300"
                />
              ) : (
                <div className="h-72 w-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center ring-1 ring-gray-300">
                  <Building className="w-20 h-20 text-indigo-300" />
                </div>
              )}
            </div>

            {/* Documents */}
            {company.companyDetails?.documents?.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-4 ring-1 ring-indigo-200 shadow-md">
                <h3 className="text-sm font-bold text-indigo-900 mb-3">
                  Documents
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {company.companyDetails.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-lg p-3 flex items-center space-x-3 hover:bg-indigo-100 transition-all text-sm shadow-md"
                    >
                      <FileText className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
                      <span className="text-indigo-700 font-medium">
                        Document {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-4 ring-1 ring-indigo-200 shadow-md">
              <h3 className="text-sm font-bold text-indigo-900 mb-3">
                Company Information
              </h3>
              <div className="grid md:grid-cols-2 gap-3 bg-white/90 rounded-lg p-3">
                <DetailRow
                  icon={<Building className="w-4 h-4" />}
                  label="Company Name"
                  value={company.companyDetails?.companyInfo?.companyName}
                />
                <DetailRow
                  icon={<Users className="w-4 h-4" />}
                  label="Owner Name"
                  value={company.companyDetails?.companyInfo?.ownerName}
                />
                <DetailRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Year Established"
                  value={company.companyDetails?.companyInfo?.yearEstablishment}
                />
                <DetailRow
                  icon={<Users className="w-4 h-4" />}
                  label="Total Employees"
                  value={company.companyDetails?.companyInfo?.totalEmployees}
                />
                <DetailRow
                  icon={<BarChart2 className="w-4 h-4" />}
                  label="Business Type"
                  value={company.companyDetails?.companyInfo?.businessType}
                />
                <DetailRow
                  icon={<Hash className="w-4 h-4" />}
                  label="GST Number"
                  value={company.companyDetails?.companyInfo?.gstNo}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-4 ring-1 ring-indigo-200 shadow-md">
              <h3 className="text-sm font-bold text-indigo-900 mb-3">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-3 bg-white/90 rounded-lg p-3">
                <DetailRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={company.companyDetails?.contactInfo?.email}
                />
                <DetailRow
                  icon={<PhoneCall className="w-4 h-4" />}
                  label="Phone"
                  value={company.companyDetails?.contactInfo?.phone}
                />
                <DetailRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={
                    <>
                      <p>
                        <strong>Address:</strong>{" "}
                        {company.companyDetails?.contactInfo?.address ||
                          "Not Available"}
                      </p>
                      <p>
                        <strong>City:</strong>{" "}
                        {company.companyDetails?.contactInfo?.city ||
                          "Not Available"}
                      </p>
                      <p>
                        <strong>State:</strong>{" "}
                        {company.companyDetails?.contactInfo?.state ||
                          "Not Available"}
                      </p>
                      <p>
                        <strong>Pincode:</strong>{" "}
                        {company.companyDetails?.contactInfo?.pincode ||
                          "Not Available"}
                      </p>
                    </>
                  }
                />

                <DetailRow
                  icon={<Info className="w-4 h-4" />}
                  label="About"
                  value={company.companyDetails?.companyInfo?.companyAbout}
                />
              </div>
            </div>

            {/* Actions */}
            {/* Right Columns */}
            <div className="md:col-span-2 space-y-6">
              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => onUpdateStatus(company._id, "verified")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusConfig.verifyButtonClass}`}
                  disabled={status === "verified"}
                >
                  {status === "verified" ? "Verified" : "Verify Company"}
                </button>
                <button
                  onClick={() => onUpdateStatus(company._id, "rejected")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusConfig.rejectButtonClass}`}
                  disabled={status === "rejected"}
                >
                  {status === "rejected" ? "Rejected" : "Reject Company"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
