import React, { useEffect, useState } from "react";
import {
  Download,
  Search,
  MessageSquare,
  Users,
  ChevronRight,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../../services/axios";

// Stat Card Component with Trend Indication
const StatCard = ({ icon, value, title, route, percentageChange, trend }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <button
          onClick={() => navigate(route)}
          className="text-sm text-blue-600 flex items-center"
        >
          View More <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="text-2xl font-bold mr-2">{value}</div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {percentageChange}%
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm mt-1">{title}</div>
    </div>
  );
};

// Enhanced Breakdown Component with More Details
const Breakdown = ({ title, data, additionalData = {} }) => {
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title} Breakdown
      </h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600 capitalize">
              {key === "active"
                ? "Active"
                : key === "inactive"
                ? "Inactive"
                : key === "draft"
                ? "Draft"
                : key === "resolved"
                ? "Resolved"
                : key === "pending"
                ? "Pending"
                : key}
            </span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}

        {/* Additional Context for Specific Breakdowns */}
        {additionalData && Object.keys(additionalData).length > 0 && (
          <div className="border-t mt-2 pt-2">
            <h4 className="text-xs font-medium text-gray-500 mb-1">
              Additional Context
            </h4>
            {Object.entries(additionalData).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{key}</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Menu Component (Unchanged from previous version)
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

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
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
    // Simulating the API call with mock data if needed
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/admin/analytics/dashboard-stats`);
        setAnalyticsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optional: Set some mock data for development
        setAnalyticsData({
          companies: {
            total: 4,
            percentageChange: 100,
            trend: "up",
            breakdown: {
              active: 3,
              inactive: 1,
            },
          },
          products: {
            total: 11,
            percentageChange: 100,
            trend: "up",
            breakdown: {
              active: 1,
              inactive: 0,
              draft: 0,
            },
          },
          forums: {
            total: 6,
            percentageChange: 100,
            trend: "up",
            breakdown: {
              active: 5,
              inactive: 1,
            },
          },
          reports: {
            total: 4,
            percentageChange: 100,
            trend: "up",
            breakdown: {
              resolved: 2,
              pending: 2,
            },
          },
        });
      }
    };

    fetchAnalytics();
  }, []);

  const handleDownload = () => {
    if (!analyticsData) return;

    const data = [
      {
        Metric: "Total Companies",
        Count: analyticsData.companies.total,
        Active: analyticsData.companies.breakdown?.active || 0,
        Inactive: analyticsData.companies.breakdown?.inactive || 0,
        PercentageChange: analyticsData.companies.percentageChange,
        Trend: analyticsData.companies.trend,
      },
      {
        Metric: "Total Forums",
        Count: analyticsData.forums.total,
        Active: analyticsData.forums.breakdown?.active || 0,
        Inactive: analyticsData.forums.breakdown?.inactive || 0,
        PercentageChange: analyticsData.forums.percentageChange,
        Trend: analyticsData.forums.trend,
      },
      {
        Metric: "Total Products",
        Count: analyticsData.products.total,
        Active: analyticsData.products.breakdown?.active || 0,
        Inactive: analyticsData.products.breakdown?.inactive || 0,
        Draft: analyticsData.products.breakdown?.draft || 0,
        PercentageChange: analyticsData.products.percentageChange,
        Trend: analyticsData.products.trend,
      },
      {
        Metric: "Total Product Reports",
        Count: analyticsData.reports.total,
        Resolved: analyticsData.reports.breakdown?.resolved || 0,
        Pending: analyticsData.reports.breakdown?.pending || 0,
        PercentageChange: analyticsData.reports.percentageChange,
        Trend: analyticsData.reports.trend,
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, "admin_analytics.xlsx");
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  if (!analyticsData) return <div>Loading...</div>;

  return (
    <div className="p-2 bg-gray-50 min-h-screen relative">
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
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-blue-100"
          >
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
            value={analyticsData.companies.total}
            title="Total Companies"
            route="/company-profile"
            percentageChange={analyticsData.companies.percentageChange}
            trend={analyticsData.companies.trend}
          />
        )}
        {filters.forum && (
          <StatCard
            icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            value={analyticsData.forums.total}
            title="Total Forums"
            route="/company-forum"
            percentageChange={analyticsData.forums.percentageChange}
            trend={analyticsData.forums.trend}
          />
        )}
        {filters.product && (
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            value={analyticsData.products.total}
            title="Total Products"
            route="/company-products"
            percentageChange={analyticsData.products.percentageChange}
            trend={analyticsData.products.trend}
          />
        )}
        {filters.productReport && (
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            value={analyticsData.reports.total}
            title="Total Product Reports"
            route="/report-product"
            percentageChange={analyticsData.reports.percentageChange}
            trend={analyticsData.reports.trend}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filters.company && analyticsData.companies.breakdown && (
          <Breakdown
            title="Companies"
            data={analyticsData.companies.breakdown}
            additionalData={{
              "Total Companies": analyticsData.companies.total,
              "Percentage Change": `${analyticsData.companies.percentageChange}%`,
            }}
          />
        )}
        {filters.forum && analyticsData.forums.breakdown && (
          <Breakdown
            title="Forums"
            data={analyticsData.forums.breakdown}
            additionalData={{
              "Total Forums": analyticsData.forums.total,
              "Percentage Change": `${analyticsData.forums.percentageChange}%`,
            }}
          />
        )}
        {filters.product && analyticsData.products.breakdown && (
          <Breakdown
            title="Products"
            data={analyticsData.products.breakdown}
            additionalData={{
              "Total Products": analyticsData.products.total,
              "Percentage Change": `${analyticsData.products.percentageChange}%`,
            }}
          />
        )}
        {filters.productReport && analyticsData.reports.breakdown && (
          <Breakdown
            title="Product Reports"
            data={analyticsData.reports.breakdown}
            additionalData={{
              "Total Reports": analyticsData.reports.total,
              "Percentage Change": `${analyticsData.reports.percentageChange}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
