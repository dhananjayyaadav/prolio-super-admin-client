import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

function ProductList({ list, header, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const data = useMemo(() => list, [list]);

  const columns = [
    {
      header: "No.",
      accessorKey: "id",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Image",
      accessorKey: "productImage",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="Product"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      header: "Product Name",
      accessorKey: "productName",
    },
    {
      header: "Product ID ",
      accessorKey: "productId",
    },
    {
      header: "Appled Date",
      accessorKey: "createdAt",
    },
    {
      header: "Company",
      accessorKey: "companyName",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } }, // Set initial page size
  });

  const renderComponent = () => {
    if (loading) {
      return smallSpinner();
    } else if (data?.length === 0) {
      return (
        <div className="flex justify-center pt-20 items-center bg-transparent text-red-400">
          No data available.
        </div>
      );
    } else {
      return tableList();
    }
  };

  const smallSpinner = () => {
    return (
      <div className="w-full h-[250px] flex justify-center items-center mt-2 overflow-auto">
        <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "text-gray-700/85 font-bold";
      case "approved":
        return "text-green-500/100 font-semibold";
      case "draft":
        return "text-orange-600 font-semibold";
      case "block":
        return "text-red-600 font-semibold";
      default:
        return "inherit"; // Default color
    }
  };

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [showRowTableProduct, setShowRowTableProduct] = useState(false);

  const handleRowClick = (event) => {
    const clickedId = event.currentTarget.getAttribute("data-id");
    setSelectedRowId(clickedId);
    setShowTable(false);
    setShowRowTableProduct(true);
  };

  const handleClose = () => {
    onSubmit();
    setShowTable(true);
    setShowRowTableProduct(false);
  };

  const tableList = () => {
    return (
      <div className="w-auto h-auto shadow-md shadow-gray-400 rounded-md bg-white mt-2 ">
        <div className="w-full flex justify-between  py-3 px-5">
          <h1 className="font-santoshi px-5 bg-blue-900 text-white py-1 rounded-md font-semibold">
            {header}
          </h1>
          <div className="flex gap-x-5 items-end">
            <select className="border px-7 py-1 rounded-md focus:outline-none border-blue-900">
              <option value="">Category</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
            </select>
            <select className="border px-10 py-1 rounded-md focus:outline-none border-blue-900">
              <option value="">SubCategory</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
              <option value="">sbbh</option>
            </select>
            <input
              type="text"
              placeholder="search.."
              className="border px-2 py-1 rounded-md focus:outline-none border-blue-900"
            />
          </div>
        </div>

        <div className="w-auto px-8 bg-transparent">
          <hr className="border-black bg-transparent" />
          <div className="w-full pt-2">
            <table className="w-full overflow-x-auto bg-blue-50">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4  text-left">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
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
                    className="border-b cursor-pointer hover:bg-white"
                    onClick={handleRowClick}
                    data-id={row.original.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-1 capitalize ${getStatusColor(
                          cell.getValue()
                        )}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-end  py-2">
            {/* <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 border text-blue-900 bg-red-100 rounded mx-1"
            >
              Previous
            </button> */}
            {table.getPageOptions().map((page, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(page)}
                disabled={page === table.getState().pagination.pageIndex}
                className={`px-5 py-1  rounded mx-1 ${
                  page === table.getState().pagination.pageIndex
                    ? "bg-blue-900 border text-white"
                    : ""
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1  rounded mx-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showTable && renderComponent()}
      {/* Uncomment this section if you have a ProductSinglePage component */}
      {/* {showRowTableProduct && (
        <ProductSinglePage
          id={selectedRowId}
          onClose={handleClose}
          headers={header}
        />
      )} */}
    </>
  );
}

export default ProductList;