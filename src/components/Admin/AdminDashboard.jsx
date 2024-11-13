import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Download,
  Search,
  MessageSquare,
  Users,
  ChevronRight,
  Filter,
  X, // Make sure to import the 'X' icon from lucide-react
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const StatCard = ({ icon, value, title, route }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <button
          onClick={() => navigate(route)}
          className="text-sm text-blue-600 flex items-center"
        >
          View More <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{title}</div>
    </div>
  );
};

const FilterMenu = ({ show, onClose, filters, onFilterChange }) => {
  return (
    <div
      className={`
      absolute right-12 top-12 z-50 transform transition-all duration-200 ease-in-out
      ${
        show
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0 pointer-events-none"
      }
    `}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Show Items</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {Object.entries(filters).map(([key, checked]) => (
            <label
              key={key}
              className="flex items-center p-1 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <input
                type="checkbox"
                name={key}
                checked={checked}
                onChange={onFilterChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {key === "productReport" ? "Product Reports" : `${key}s`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const apiURL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [totalCompanyCount, setTotalCompanyCount] = useState(0);
  const [totalForumCount, setTotalForumCount] = useState(0);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [totalProductReportCount, setTotalProductReportCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    company: true,
    forum: true,
    product: true,
    productReport: true,
  });

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    axios
      .get(`${apiURL}/admin/totalCounts`)
      .then((response) => {
        const {
          totalCompanyCount,
          totalForumCount,
          totalProductCount,
          totalProductReportCount,
        } = response.data;

        setTotalCompanyCount(totalCompanyCount);
        setTotalForumCount(totalForumCount);
        setTotalProductCount(totalProductCount);
        setTotalProductReportCount(totalProductReportCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDownload = () => {
    const data = [
      { Metric: "Total Companies", Count: totalCompanyCount },
      { Metric: "Total Forums", Count: totalForumCount },
      { Metric: "Total Products", Count: totalProductCount },
      { Metric: "Total Product Reports", Count: totalProductReportCount },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Stats");
    XLSX.writeFile(workbook, "dashboard_stats.xlsx");
  };

  // Handle filter toggle (show/hide filter modal)
  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen relative">
      <div className="mb-1 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleFilter}
            className={`p-2 rounded-full transition-colors ${
              showFilter
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-blue-100">
            <Download className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <FilterMenu
        show={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filters.company && (
          <StatCard
            icon={<Search className="h-5 w-5 text-blue-600" />}
            value={totalCompanyCount}
            title="Total Companies"
            route="/admin/company"
          />
        )}
        {filters.forum && (
          <StatCard
            icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            value={totalForumCount}
            title="Total Forums"
            route="/admin/forum"
          />
        )}
        {filters.product && (
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            value={totalProductCount}
            title="Total Products"
            route="/admin/product"
          />
        )}
        {filters.productReport && (
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            value={totalProductReportCount}
            title="Total Product Reports"
            route="/admin/reports"
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
