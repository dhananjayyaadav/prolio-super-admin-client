import React, { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axios";
import Pagination from "../../../utils/Pagination";

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCompanies: 0,
  });
  const [filters, setFilters] = useState({
    businessType: "",
    employeeRange: "",
    verificationStatus: "",
  });

  // Fetch companies based on current state
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

      const { customers, totalPages, totalCompanies } = response.data.message;
      setCompanies(customers || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: totalPages || 0,
        totalCompanies: totalCompanies || 0,
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies when dependencies change
  useEffect(() => {
    fetchCompanies();
  }, [pagination.currentPage, searchQuery, filters]);

  // Navigate to company forums
  const navigateToCompanyForums = (companyId, companyName) => {
    navigate(`/companies/${companyId}/forums`, {
      state: { companyName },
    });
  };

  // Render individual company row
  const renderCompanyRow = (company) => (
    <tr
      key={company._id}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="p-4 flex items-center">
        {company.companyDetails?.companyLogo?.url ? (
          <img
            src={company.companyDetails.companyLogo.url}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-cover mr-4"
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
          <div className="text-sm text-gray-500">
            {company.companyDetails?.companyInfo?.businessType || "N/A"}
          </div>
        </div>
      </td>
      <td className="p-4 text-gray-600">
        {company.companyDetails?.contactInfo?.email || "N/A"}
      </td>
      <td className="p-4 text-gray-700 font-medium">
        {company.companyDetails?.companyInfo?.totalEmployees || "N/A"}
      </td>
      <td className="p-4 text-gray-600">{company?.totalForums || 0}</td>
      <td className="py-3 px-4">
        <button
          onClick={() =>
            navigateToCompanyForums(
              company._id,
              company.companyDetails?.companyInfo?.companyName
            )
          }
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 max-h-screen p-0">
      <div className="container mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Manage Company Forum
          </h1>
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
                  <th className="p-4 text-left text-blue-800">Total Forums</th>
                  <th className="p-4 text-left text-blue-800">Actions</th>
                </tr>
              </thead>
              <tbody>{companies.map(renderCompanyRow)}</tbody>
            </table>
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, currentPage: page }))
              }
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
