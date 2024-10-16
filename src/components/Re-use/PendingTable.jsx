import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiSearch, FiX } from "react-icons/fi";
import CompanyRowDetails from "./CompanyRowDetails";

export default function PendingTable({ data, columns, value }) {
  const [filtering, setFiltering] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showRowDetails, setShowRowDetails] = useState(false);
  const [showTableDetails, setShowTableDetails] = useState(true);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowRowDetails(true);
    setShowTableDetails(false);
  };

  const handleClose = () => {
    setShowRowDetails(false);
    setShowTableDetails(true);
  };

  const renderTable = () => (
    <>
      <div className="flex justify-between items-center px-5">
        <h1 className="text-xl text-blue-900 font-santoshi font-semibold">
          {value}
        </h1>
        {!isInputOpen ? (
          <FiSearch
            className="mx-5 text-2xl cursor-pointer"
            onClick={() => setIsInputOpen(true)}
          />
        ) : (
          <FiX
            className="mx-5 text-2xl cursor-pointer"
            onClick={() => {
              setIsInputOpen(false);
              setFiltering(""); // Clear input value when closing
            }}
          />
        )}
      </div>
      {isInputOpen && (
        <div className="flex items-center px-5 mt-3">
          <input
            type="text"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 px-3 py-2 rounded-md flex-1 focus:outline-none"
          />
        </div>
      )}

      <div className="pt-4 px-8 bg-transparent">
        <hr className="border-gray-500 bg-transparent" />
        <div className="w-full overflow-x-auto mt-3 bg-blue-50">
          <table className="w-full bg-blue-50 mt-3">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 font-santoshi text-left"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex font-santoshi items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-transparent">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b font-santoshi hover:bg-white" // Remove cursor pointer
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 bg-transparent font-santoshi ${
                        cell.column.id === "status" &&
                        cell.getValue() === "pending"
                          ? "text-blue-900 font-semibold"
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {cell.column.id === "action" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleRowClick(row.original); // Call the action
                          }}
                          className=" text-blue-700 hover:underline"
                        >
                          Action
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="lg:w-[1070px] h-auto w-full pb-5 rounded-md bg-white mt-5">
      <div className="bg-transparent pt-5">
        {showTableDetails && renderTable()}
        {showRowDetails && (
          <CompanyRowDetails data={selectedRowData} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}
