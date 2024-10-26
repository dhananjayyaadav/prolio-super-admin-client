import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Info,
  FileEdit,
  Package,
  Tag,
  Search,
  Filter,
  X,
} from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

// Custom Badge Component
const Badge = ({ children, className, onClick }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
    onClick={onClick}
  >
    {children}
  </span>
);

// Custom Button Component
const Button = ({ children, className, onClick, disabled }) => (
  <button
    className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

// Dropdown Component
const Dropdown = ({ trigger, content, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          {content}
        </div>
      )}
    </div>
  );
};

// Action Badge
const ActionBadge = ({ action }) => {
  const colors = {
    UPDATE_PRICE: "bg-yellow-100 text-yellow-800",
    UPDATE_DETAILS: "bg-blue-100 text-blue-800",
    UPDATE_INVENTORY: "bg-green-100 text-green-800",
    UPDATE_PRODUCT: "bg-purple-100 text-purple-800",
    default: "bg-gray-100 text-gray-800",
  };

  const labels = {
    UPDATE_PRICE: "Price Update",
    UPDATE_DETAILS: "Details Update",
    UPDATE_INVENTORY: "Inventory Update",
    UPDATE_PRODUCT: "Product Update",
  };

  return (
    <Badge className={colors[action] || colors.default}>
      {labels[action] || action}
    </Badge>
  );
};

// Column Header Component
const ColumnHeader = ({ title }) => (
  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
    {title}
  </th>
);

// Filter Dropdown
const FilterDropdown = ({
  visibleColumns,
  setVisibleColumns,
  uniqueActions,
  selectedActions,
  setSelectedActions,
}) => {
  return (
    <div className="p-3">
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Columns</h3>
          <div className="space-y-1">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-3">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Actions</h3>
          <div className="space-y-1">
            {uniqueActions.map((action) => (
              <label
                key={action}
                className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedActions.includes(action)}
                  onChange={() => {
                    setSelectedActions((prev) =>
                      prev.includes(action)
                        ? prev.filter((a) => a !== action)
                        : [...prev, action]
                    );
                  }}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">{action}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Log Page Component
const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({
    action: true,
    username: true,
    companyName: true,
    description: true,
    timestamp: true,
  });

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  const filteredLogs = logs.filter(
    (log) =>
      (!selectedActions.length || selectedActions.includes(log.action)) &&
      (log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.companyName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/getAllLogs`
        );
        setLogs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);
  const truncateText = (text, maxLength = 50, ellipsis = "...") => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}${ellipsis}`
      : text;
  };
  {
  }
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
          <div className="flex items-center space-x-4">
            {/* Compact Search Bar */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full h-8 pl-8 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
            </div>

            {/* Filter Button */}
            <Dropdown
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
              trigger={
                <Button className="h-8">
                  <Filter className="w-4 h-4 mr-1" /> Filter
                </Button>
              }
              content={
                <FilterDropdown
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  uniqueActions={uniqueActions}
                  selectedActions={selectedActions}
                  setSelectedActions={setSelectedActions}
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-500">
          <thead>
            <tr>
              {visibleColumns.action && <ColumnHeader title="Action" />}
              {visibleColumns.username && <ColumnHeader title="User Name" />}
              {visibleColumns.companyName && <ColumnHeader title="Company" />}
              {visibleColumns.description && (
                <ColumnHeader title="Description / Changes" />
              )}
              {visibleColumns.timestamp && <ColumnHeader title="Date & Time" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No logs found
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  {visibleColumns.action && (
                    <td className="px-4 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                  )}
                  {visibleColumns.username && (
                    <td className="px-4 py-3 text-sm text-gray-900 relative group">
                      {log.username.split(" ")[0]} {/* Show first name */}
                      {log.username && (
                        <div className="absolute z-10 p-2 text-xs bg-gray-900 text-white rounded shadow-lg -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {log.username}
                        </div>
                      )}
                    </td>
                  )}
                  {visibleColumns.companyName && (
                    <td className="px-4 py-3 text-sm text-gray-900 relative group">
                      {truncateText(log.companyName, 10)}{" "}
                      {/* Shortened company name */}
                      {log.companyName && (
                        <div className="absolute z-10 p-2 text-xs bg-gray-900 text-white rounded shadow-lg -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {log.companyName}
                        </div>
                      )}
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-4 py-3 text-sm text-gray-500 relative group">
                      {truncateText(log.description)}
                      {log.description && log.description.length > 50 && (
                        <div className="absolute z-10 p-2 text-xs bg-gray-900 text-white rounded shadow-lg -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {log.description}
                        </div>
                      )}
                    </td>
                  )}
                  {visibleColumns.timestamp && (
                    <td className="px-4 py-3 text-sm text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimestamp(log.createdAt, { dateOnly: true })}{" "}
                      {/* Short date format */}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                  filteredLogs.length
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}
              </span>{" "}
              of <span className="font-medium">{filteredLogs.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogPage;
