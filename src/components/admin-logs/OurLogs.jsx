import React, { useState, useEffect, useCallback } from "react";
import { Search, AlertCircle, Filter } from "lucide-react";
import api from "../../services/axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { AiOutlineClockCircle } from "react-icons/ai";
import Pagination from "../../utils/Pagination";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OurLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const { companyId } = useParams();

  const [columnConfig, setColumnConfig] = useState({
    columns: [
      { key: "action", label: "Action", visible: true },
      { key: "targetModel", label: "Target", visible: true },
      { key: "customerName", label: "Customer Name", visible: true },
      { key: "createdAt", label: "Timestamp", visible: true },
    ],
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/admin/logs/our-logs`, {
        params: {
          page: currentPage,
          search: searchTerm,
          pageSize: 7,
        },
      });

      const { logs, totalPages, totalItems } = response.data.data;
      setLogs(logs);
      setTotalPages(totalPages);
      setTotalItems(totalItems || logs.length);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong while fetching logs."
      );
    } finally {
      setLoading(false);
    }
  }, [companyId, currentPage, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleColumnVisibility = (columnKey) => {
    setColumnConfig((prev) => ({
      columns: prev.columns.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      ),
    }));
  };

  const renderLogEntry = (log) => {
    const visibleColumns = columnConfig.columns.filter((col) => col.visible);

    const formattedDate = {
      fullDate: format(new Date(log.createdAt), "dd MMM yyyy, EEEE"),
      timeAgo: format(new Date(log.createdAt), "hh:mm a"),
    };

    return (
      <div
        key={log._id}
        className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 transition-colors rounded-lg shadow-md"
      >
        {visibleColumns.map((col) => {
          switch (col.key) {
            case "createdAt":
              return (
                <div
                  key={col.key}
                  className="flex flex-col text-gray-700"
                  title={formattedDate.fullDate}
                >
                  <div className="flex items-center space-x-2">
                    <AiOutlineClockCircle className="w-4 h-4 text-gray-500" />
                    <span>{formattedDate.timeAgo}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formattedDate.fullDate}
                  </div>
                </div>
              );

            case "action":
            case "targetModel":
              return (
                <Tippy content={log[col.key] || "N/A"} placement="top">
                  <div key={col.key} className="truncate text-gray-800">
                    {log[col.key]?.length > 30
                      ? `${log[col.key].substring(0, 30)}...`
                      : log[col.key] || "N/A"}
                  </div>
                </Tippy>
              );

            case "customerName":
              return (
                <Tippy
                  content={
                    log.targetModel === "Customer" ? log.targetId?.name : "N/A"
                  }
                  placement="top"
                >
                  <div key={col.key} className="truncate text-gray-800">
                    {log.targetModel === "Customer"
                      ? log.targetId?.name
                      : "N/A"}
                  </div>
                </Tippy>
              );

            default:
              return (
                <Tippy content={log[col.key] || "N/A"} placement="top">
                  <div key={col.key} className="truncate text-gray-800">
                    {log[col.key] || "N/A"}
                  </div>
                </Tippy>
              );
          }
        })}
      </div>
    );
  };

  const renderColumnDropdown = () => (
    <div className="p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-8xl font-semibold mb-3 text-gray-700">
        Manage Columns
      </h3>
      {columnConfig.columns.map((column) => (
        <label
          key={column.key}
          className="flex items-center space-x-2 py-2 hover:bg-gray-50 rounded-md"
        >
          <input
            type="checkbox"
            checked={column.visible}
            onChange={() => toggleColumnVisibility(column.key)}
            className="form-checkbox h-4 w-4 text-gray-600 rounded"
          />
          <span className="text-sm text-gray-700">{column.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-2xl shadow-lg font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <AlertCircle className="mr-3 text-gray-600" />
          Activity Log
        </h2>

        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2.5 w-full border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Column Visibility Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownVisible((prev) => !prev)}
            className="p-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          {isDropdownVisible && (
            <div className="absolute right-0 mt-2 w-64 z-10">
              {renderColumnDropdown()}
            </div>
          )}
        </div>
      </div>

      {/* Logs Content */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">
          Loading activity logs...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No activity logs found.
        </div>
      ) : (
        <>
          {/* Column Headers */}
          <div className="grid grid-cols-4 bg-gray-50 p-4 border-b font-semibold text-gray-700">
            {columnConfig.columns
              .filter((col) => col.visible)
              .map((col) => (
                <div key={col.key}>{col.label}</div>
              ))}
          </div>

          {/* Log Entries */}
          {logs.map((log) => renderLogEntry(log))}
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
};

export default OurLogs;
