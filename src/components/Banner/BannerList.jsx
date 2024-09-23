import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
// import { IoIosArrowBack } from "react-icons/io";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Icon } from "@iconify-icon/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useSelector } from "react-redux";
// import ProductSinglePage from "./ProductSinglePage";
// import { Icon } from "@mui/material";

function BannerList({ list, header, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();

  const data = useMemo(() => {
    const filteredList = list.filter((item) => {
      if (header === "Active") {
        return item.status === "active";
      } else if (header === "Inactive") {
        return item.status === "inactive";
      }
      return true;
    });

    return filteredList.map((item, index) => ({
      ...item,
      id: index + 1, // Adding a sequential ID
      src: `${process.env.REACT_APP_API_HOST}/uploads/${item.filename}`, // Constructing full URL for images
      uploadAt: new Date(item.uploadDate).toLocaleDateString(), // Formatting the upload date
    }));
  }, [list, header]);

  const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "id",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Image",
        accessorFn: (row) => row.src,
        cell: (info) => (
          <div className="overflow-hidden block w-44 h-12">
            <img
              src={info.getValue()}
              alt="Zoomable"
              className="transition-transform duration-500 transform hover:scale-120 w-full h-full object-cover"
            />
          </div>
        ),
      },

      {
        header: "Uploaded At",
        accessorKey: "uploadAt", // use a formatted date string from data
      },
      {
        header: "Status",
        accessorKey: "status",
      },
    ],
    []
  );

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
    switch (status) {
      case "processing":
        return "text-gray-700/85 font-bold";
      case "active":
        return "text-green-500/100 font-semibold";
      case "draft":
        return "text-orange-600 font-semibold";
      case "inactive":
        return "text-red-600 font-semibold";

      default:
        return "inherit"; // Default color
    }
  };

  const handleRowClick = (event) => {
    const clickedId = event.currentTarget.getAttribute("data-id");
    console.log("Clicked row id:", clickedId);
  };
  const handleBlockUnblock = (event, rowData) => {
    event.stopPropagation();
    setShowVerifyModal(true);
    setSelectedRowData(rowData);
  };
  const handlelose = () => {
    setShowVerifyModal(false);
  };
  const tablelist = () => {
    return (
      <>
        <div className="w-auto h-auto  shadow-md shadow-gray-400 rounded-md bg-white mt-5    mx-4">
          {/* <div className="w-auto  bg-transparent"> */}
          <div className="w-full flex  bg-transparent py-5 gap-3 px-5">
            <h1 className="font-santoshi  underline  underline-offset-4 bg-transparent text-blue-900 font-semibold">
              {header}
            </h1>
          </div>

          {/* </div> */}
          <div className=" w-[1050px] px-8 bg-transparent pb-5">
            <hr className=" border-black bg-transparent" />
            <div className="w-full  h-[250px] mt-2  overflow-auto">
              <table className="w-full overflow-x-auto   mt-3">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className=" ">
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
                      <th className="px-5 py-2 text-left ">Action</th>
                    </tr>
                  ))}
                </thead>

                <tbody className="bg-transparent">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-white"
                      onClick={handleRowClick}
                      data-id={row.original.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`px-4 py-2 bg-transparent 
                          ${getStatusColor(cell.getValue())}
                         
                          `}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                      <td className=" py-5 flex bg-transparent">
                        {/* <span
                          className="bg-blue-900 text-white w-20 cursor-pointer rounded-md text-center"
                          onClick={(event) =>
                            handleBlockUnblock(event, row.original)
                          }
                        >
                          Edit
                        </span> */}
                        <span
                          className={`${
                            row.original.status === "active"
                              ? "text-red-600 font-semibold border border-red-400"
                              : "text-green-600 font-semibold border border-green-400"
                          } font-santoshi  w-20 text-center rounded-md cursor-pointer`}
                          onClick={(event) =>
                            handleBlockUnblock(event, row.original)
                          }
                        >
                          {row.original.status === "active"
                            ? "Block"
                            : "Unblock"}
                        </span>
                      </td>
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
      {renderComponent()}

      {showVerifyModal && (
        <VerifyModal
          data={selectedRowData}
          onClose={handlelose}
          handlefetchData={onSubmit}
        />
      )}
      <ToastContainer />
    </>
  );
}

export default BannerList;

const VerifyModal = ({ data, onClose, handlefetchData }) => {
  const apiURL = process.env.REACT_APP_API_URL;

  // console.log(data);
  const handleClose = (event) => {
    if (event.target.id === "container") {
      onClose();
    }
  };

  const id = data?._id;

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiURL}/superAdmin/blockorunblock-banners/${id}`
      );
      if (response.status === 200) {
        // console.log();
        toast.success(response.data.message);
        handlefetchData();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Error updating company:", error.message);
    }
  };

  return (
    <div
      id="container"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleClose}
    >
      <div className="bg-blue-100 w-[700px] p-8  gap-6 rounded-md flex flex-col items-center justify-center ">
        <Icon
          icon="teenyicons:tick-solid"
          className="border border-blue-900 p-3 text-blue-900 rounded-full text-xl font-bold"
        />

        <p className="text-center font-santoshi font-semibold text-gray-600  mt-2">
          Are you sure You want to
          <span
            className={`font-bold px-2 ${
              data?.status === "active" ? "text-red-600" : "text-green-600"
            }`}
          >
            <br /> {data?.status === "active" ? "Block" : "Unblock"}
          </span>
          {data?.category} Category
        </p>

        <div className="flex gap-5 mt-2">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-blue-50 border border-gray-500 text-gray-800 px-7 py-2 rounded-md"
          >
            Cancel{" "}
          </button>
          <button
            className="bg-blue-900 hover:bg-blue-600 text-white px-7 py-2 rounded-md"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
