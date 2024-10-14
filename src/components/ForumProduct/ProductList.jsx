import React, { useMemo, useState } from "react";
import dotIcon from "../../assets/doticon.png";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
// import ProductSinglePage from "./ProductSinglePage";

function ProductList({ list, header, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [showRowTableProduct, setShowRowTableProduct] = useState(false);

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
      header: "Employee",
      accessorKey: "userName",
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
  });

  const renderComponent = () => {
    if (loading) {
      return smallSpiner();
    } else if (data?.length === 0) {
      return (
        <div className="flex justify-center pt-20 items-center bg-transparent text-red-400">
          No data available.
        </div>
      ); // Render message when list is empty
    } else {
      return tablelist();
    }
  };

  const smallSpiner = () => {
    return (
      <>
        <div className="w-full h-[250px]  flex justify-center items-center mt-2 overflow-auto">
          <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
        </div>
      </>
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

  const tablelist = () => {
    return (
      <>
        <div className="w-auto h-auto  shadow-md shadow-gray-400 rounded-md bg-white mt-5 mr-2">
          <div className="w-full flex  bg-transparent py-5 gap-3 px-5">
            <h1 className="font-santoshi  underline  underline-offset-4 bg-transparent text-blue-900 font-semibold">
              {header}
            </h1>
          </div>
          <div className="w-full bg-transparent px-8 pb-5">
            <hr className="border-black bg-transparent" />
            <div className="w-full overflow-x-auto mt-3">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-2 text-left">
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

                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={handleRowClick}
                      data-id={row.original.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`px-4 py-2 ${getStatusColor(
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
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {showTable && renderComponent()}

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
