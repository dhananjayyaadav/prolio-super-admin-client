import React, { useEffect, useMemo, useState } from "react";
import "./OpportunitiesTable.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import editIcon from "../../assets/doticon.png";
import axios from "axios";
// import { useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa6";

export default function OpportunitiesTable({ data, columns }) {
  const DropDownList = [
    "All Opportunities",
    "Pending",
    "Approved",
    "Cancelled",
    "Rejected",
  ];
//   const token = useSelector((state) => state.token.token);

  const [animation, setAnimation] = useState(false);

  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);

  const [filtering, setFiltering] = useState("");

  const filteredData = useMemo(() => {
    switch (selectedButton) {
      case "All Opportunities":
        return data;
      case "Pending":
        return data.filter((item) => item.status === "pending");
      case "Approved":
        return data.filter((item) => item.status === "approved");
      case "Cancelled":
        return data.filter((item) => item.status === "cancelled");
      case "Rejected":
        return data.filter((item) => item.status === "rejected");
      default:
        return data;
    }
  }, [data, selectedButton]);

  const table = useReactTable({
    data: filteredData,
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

  const renderComponent = () => {
    switch (selectedButton) {
      case "All Opportunities":
        return tablelist(filteredData); // Pass the filtered data to the function
      case "Pending":
        return tablelist(filteredData);
      case "Approved":
        return tablelist(filteredData);
      case "Cancelled":
        return tablelist(filteredData);
      case "Rejected":
        return tablelist(filteredData);
      // Add cases for other buttons if needed
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "rejected":
        return "text-red-600/100 font-bold";
      case "approved":
        return "text-green-500/100  font-bold";
      case "pending":
        return "text-gray-700/85 font-bold";
      case "cancelled":
        return "text-yellow-400 font-bold";
      default:
        return "inherit"; // Default color
    }
  };
  const [showProductView, setShowProductView] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [rowData, setRowData] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowProductView(true);
  };
  const tablelist = () => {
    return (
      <>
        <div className="w-full h-[250px] mt-2 overflow-auto">
          <table className="w-full mx-4 mt-3">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left "
                      //   onClick={header.column.getToggleSortingHandler()}
                    >
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
                  <th className="px-4 py-2 text-left ">Action</th>
                </tr>
              ))}
            </thead>

            <tbody className="bg-transparent">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-white"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 bg-transparent   ${getStatusColor(
                        cell.getValue()
                      )}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-8 py-2 bg-transparent">
                    <img
                      src={editIcon}
                      className="text-blue-500 bg-transparent hover:text-blue-700"
                      onClick={() => handleEdit(row.original)}
                    ></img>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const id = selectedRowData?._id;
  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/opportunity/get-opportunity/${id}`
        );
        console.log(response.data, "dddddddd");
        setRowData(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      }
    };

    if (id) {
      fetchData();
    }
  }, [selectedRowData]);

  return (
    <>
      <div className="w-[1070px] h-[380px]  rounded-md bg-white mt-5">
        <div className="w-full flex flex-col  bg-transparent  pt-5">
          <div className="w-full relative pl-10 bg-transparent">
            {DropDownList.map((value, key) => {
              return (
                <div key={key} className="relative inline-block bg-gray-100/85">
                  <button
                    type="button"
                    className={`py-2 font-bold px-6 ${
                      selectedButton === value
                        ? "text-white  bg-blue-900"
                        : "bg-transparent border-blue-900 border-r-2  text-blue-900"
                    }`}
                    onClick={() => setSelectedButton(value)}
                  >
                    {value}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 w-[1050px] px-8 bg-transparent">
            <hr className=" border-black bg-transparent" />

            {renderComponent()}
          </div>
        </div>
      </div>
      {showProductView && (
        <div
          className={`slider-container  bg-white  ${
            animation ? "close-animation" : ""
          }`}
        >
          <div
            className={` flex justify-between  p-3 ${
              rowData?.status === "approved" ? "bg-green-500" : "bg-blue-900"
            }`}
          >
            <CloseIcon
              className="border-b border-blue-900 "
              onClick={() => {
                setAnimation(true);
                setTimeout(() => {
                  setShowProductView(false);
                  setAnimation(false);
                }, 300);
              }}
            />

            <h1
              className={` font-santoshi    ${
                rowData?.status === "approved"
                  ? "text-black bg-transparent"
                  : "text-white bg-blue-900"
              }`}
            >
              Opportunities
            </h1>

            <button className="text-blue-900 px-5 mx-14 rounded-sm  font-santoshi bg-white">
              {rowData?.status}
            </button>
          </div>

          <div className="bg-white w-full h-full overflow-y-auto pb-10">
            <h1 className=" mt-5 pl-20 bg-transparent font-santoshi text-sm  text-gray-400 font-semibold">
              Comapny Details
            </h1>

            <div className="flex mt-7 bg-transparent  text-sm font-santoshi">
              <div className="w-1/2  flex flex-col bg-transparent  pl-20">
                <div className="bg-transparent flex justify-between">
                  <span className="bg-white font-santoshi text-gray-400">
                    Company Name
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.companyName}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="bg-transparent text-gray-400 ">
                    Owner Name
                  </span>
                  <span className="bg-transparent pr-10  text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.OwnerName}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="bg-transparent text-gray-400 ">State</span>
                  <span className="bg-transparent pr-10  text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.state}
                  </span>
                </div>
              </div>

              <div className="w-1/2 bg-transparentflex flex-col bg-transparent  pl-10">
                <div className="bg-transparent flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Registration Number
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.registrationNumber}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Business Type
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.businessType}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Year of Establishment
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.companyId?.yearOfRegister}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white flex justify-center items-center ">
              <div className="w-4/5 mt-5 bg-blue-100/50 rounded-md p-5">
                <h1 className="bg-transparent font-bold  font-santoshi">
                  Product Details
                </h1>
                <div className="flex gap-3 bg-transparent p-1">
                  <div className="bg-transparent">
                    <img
                      src={
                        rowData?.productId?.questions?.steps[0]?.questions[8]?.images[0]
                          .base64 || (
                          <FaRegUser className="bg-transparent w-12 h-12 rounded-full text-blue-900 " />
                        )
                      }
                      alt=""
                      className="w-32 h-24 object-center bg-transparent"
                    />
                  </div>
                  <div className="bg-transparent ">
                    <h1 className="font-santoshi bg-transparent  font-semibold text-gray-700">
                      {
                       rowData?.productId?.questions?.steps[0]?.questions[0]?.value
                      }
                    </h1>
                    <p className="text-blue-800 bg-transparent font-santoshi font-medium">
                      By {rowData?.companyId?.companyName}{" "}
                    </p>
                    <p className="font-normal text-gray-500 bg-transparent">
                      {
                        rowData?.productId?.questions?.steps[0]?.questions[5]?.value
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between bg-transparent mt-5">
              <h1 className="  pl-20 bg-transparent font-santoshi text-sm  text-gray-400 font-semibold">
                Applied Details
              </h1>
              <button className="mx-14 bg-blue-900 text-white px-5 rounded-md font-santoshi text-sm">
                Edit
              </button>
            </div>
            <div className="flex mt-7 bg-transparent  text-sm font-santoshi">
              <div className="w-1/2  flex flex-col bg-transparent  pl-20">
                <div className="bg-transparent flex justify-between">
                  <span className="bg-white font-santoshi text-gray-400">
                    Name
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.firstName} {rowData?.formData?.lastName}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="bg-transparent text-gray-400 ">Email</span>
                  <span className="bg-transparent pr-10  text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.email}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="bg-transparent text-gray-400 ">Address</span>
                  <span className="bg-transparent pr-10  text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.address}
                  </span>
                </div>
              </div>

              <div className="w-1/2 bg-transparentflex flex-col bg-transparent  pl-10">
                <div className="bg-transparent flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Contact Number
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.mobileNumber}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Year of Expirence
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.yearsOfExperience}
                  </span>
                </div>
                <div className="bg-transparent pt-5 flex justify-between">
                  <span className="  bg-transparent font-santoshi text-gray-400">
                    Product Deal with
                  </span>
                  <span className="bg-transparent pr-10 text-gray-500 font-semibold font-santoshi">
                    {rowData?.formData?.productsDealtWith}
                  </span>
                </div>
              </div>
            </div>

            <h1 className=" mt-5 pl-20 bg-transparent font-santoshi text-sm  text-gray-400 font-semibold">
              Documment Details
            </h1>
            {/* <div className="w-full h-[200px] bg-orange-300"></div> */}
          </div>
        </div>
      )}
    </>
  );
}
