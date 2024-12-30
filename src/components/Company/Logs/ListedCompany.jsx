import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowLeft,
  ArrowRight,
  X,
  Building,
  Mail,
  Users,
  Filter,
  MoreVertical,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  BarChart2,
  PhoneCall,
  Hash,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";
import { Calendar as CalendarIcon } from "lucide-react";
import Pagination from "../../../utils/Pagination";

// Company Detail Modal Component

// Reusable Detail Row Component
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-gray-800 font-semibold">{value || "Not Available"}</p>
    </div>
  </div>
);

const CompanyDetailModal = ({ company, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl animate-fade-in-down">
        {/* Header Section */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-t-3xl px-6 py-5 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <Building className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">
              {company.companyDetails?.companyInfo?.companyName ||
                "Company Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 group-hover:rotate-180 transition-transform" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="p-8 grid md:grid-cols-3 gap-8">
          {/* Left Column: Logo and Documents */}
          <div className="md:col-span-1 flex flex-col space-y-6">
            {/* Company Logo */}
            <div className="flex flex-col items-center">
              {company.companyDetails?.companyLogo?.url ? (
                <img
                  src={company.companyDetails.companyLogo.url}
                  alt={`Logo of ${company.companyDetails?.companyInfo?.companyName}`}
                  className="w-64 h-64 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center">
                  <Building className="w-24 h-24 text-blue-400 opacity-50" />
                </div>
              )}
            </div>

            {/* Documents Section */}
            {company.companyDetails?.documents?.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                  Attached Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {company.companyDetails.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 rounded-xl p-4 flex items-center justify-center hover:bg-blue-200 transition-colors group shadow-sm"
                    >
                      <FileText className="mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-blue-700 font-medium text-sm">
                        Doc {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Columns: Company Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                Company Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Building className="w-6 h-6 text-blue-500" />}
                  label="Company Name"
                  value={company.companyDetails?.companyInfo?.companyName}
                />
                <DetailRow
                  icon={<Users className="w-6 h-6 text-blue-500" />}
                  label="Owner Name"
                  value={company.companyDetails?.companyInfo?.ownerName}
                />
                <DetailRow
                  icon={<Calendar className="w-6 h-6 text-blue-500" />}
                  label="Year Established"
                  value={company.companyDetails?.companyInfo?.yearEstablishment}
                />
                <DetailRow
                  icon={<BarChart2 className="w-6 h-6 text-blue-500" />}
                  label="Business Type"
                  value={company.companyDetails?.companyInfo?.businessType}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Mail className="w-6 h-6 text-blue-500" />}
                  label="Company Email"
                  value={company.companyDetails?.contactInfo?.email}
                />
                <DetailRow
                  icon={<PhoneCall className="w-6 h-6 text-blue-500" />}
                  label="Company Phone"
                  value={company.companyDetails?.contactInfo?.phone}
                />
                <DetailRow
                  icon={<MapPin className="w-6 h-6 text-blue-500" />}
                  label="Address"
                  value={[
                    company.companyDetails?.contactInfo?.address,
                    company.companyDetails?.contactInfo?.city,
                    company.companyDetails?.contactInfo?.state,
                    company.companyDetails?.contactInfo?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
                <DetailRow
                  icon={<Hash className="w-6 h-6 text-blue-500" />}
                  label="GST Number"
                  value={company.companyDetails?.companyInfo?.gstNo}
                />
              </div>
            </div>

            {/* Actions */}
            {/* <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => onUpdateStatus(company._id, "verified")}
                className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors"
              >
                Verify Company
              </button>
              <button
                onClick={() => onUpdateStatus(company._id, "rejected")}
                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
              >
                Reject Company
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
// Main Company List Component
const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    businessType: "",
    employeeRange: "",
    verificationStatus: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCompanies: 0,
  });

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/company/all-companies", {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          search: searchQuery,
          ...filters,
        },
      });

      setCompanies(response.data.message.customers);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalCompanies: response.data.totalCompanies || 0,
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch companies on state changes
  useEffect(() => {
    fetchCompanies();
  }, [pagination.currentPage, searchQuery, filters]);

  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const navigateToCompanyLogs = (companyId, companyName) => {
    navigate(`/companies/${companyId}/logs`, {
      state: { companyName },
    });
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Render Company Table Row
  const renderCompanyRow = (company) => (
    <tr
      key={company._id}
      className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
    >
      <td className="p-4 flex items-center">
        {company.companyDetails?.companyLogo?.url ? (
          <img
            src={company.companyDetails.companyLogo.url}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-cover mr-4 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
            <span className="text-gray-500 font-bold text-xl">
              {company.companyDetails?.companyInfo?.companyName?.charAt(0) ||
                "?"}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-800">
            {company.companyDetails?.companyInfo?.companyName ||
              "Unnamed Company"}
          </div>
          <div className="text-sm text-gray-600">
            {company.companyDetails?.companyInfo?.businessType || "N/A"}
          </div>
        </div>
      </td>
      <td className="p-4 text-gray-600">
        {company.companyDetails?.contactInfo?.email || "N/A"}
      </td>
      <td className="p-4 text-gray-600">
        {company.companyDetails?.companyInfo?.totalEmployees || "N/A"}
      </td>
      <td className="p-4 text-gray-700 font-medium">
        <button
          onClick={() => openCompanyDetails(company)}
          className="text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
      <td className="p-4">
        <div className="flex space-x-2">
          <button
            onClick={() =>
              navigateToCompanyLogs(
                company._id,
                company.companyDetails?.companyInfo?.companyName
              )
            }
            className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 max-h-screen">
      <div className="container mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Company Logs</h1>
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

        {loading ? (
          <div className="text-center py-12 text-blue-600">
            Loading Companies...
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12 text-blue-500">
            No companies found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4 text-left text-blue-800">Company</th>
                  <th className="p-4 text-left text-blue-800">Email</th>
                  <th className="p-4 text-left text-blue-800">Employees</th>
                  <th className="p-4 text-left text-blue-800">View Details</th>
                  <th className="p-4 text-left text-blue-800">Actions</th>
                </tr>
              </thead>
              <tbody>{companies.map(renderCompanyRow)}</tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
            <div className="text-center "></div>
          </>
        )}
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanyList;
