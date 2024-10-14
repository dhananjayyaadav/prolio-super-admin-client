import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "./Table";

function CategoryList() {
  const navigate = useNavigate();
  const DropDownList = ["All", "Active", "Inactive"];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    {
      header: "Type Name",
      accessorKey: "type",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Sub category",
      accessorKey: "subCategories",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
  ];

  const apiURL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await axios.get(`${apiURL}/category/getAllCategory`, {
        params: { page, limit, search: searchTerm },
      });

      console.log("API Response:", response.data); // Log the response data
      const data = response.data.data || response.data; // Adjust based on the API response structure

      if (Array.isArray(data)) {
        setList(data);
        setTotalPages(response.data.totalPages); // Set total pages from the response
      } else {
        console.error("Expected an array, but received:", data);
        setList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setList([]); // Reset to an empty array on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchTerm]); // Fetch data when page or search term changes

  const transformData = (data) => {
    if (!Array.isArray(data)) return []; // Return an empty array if data is not an array

    return data.map((item) => ({
      ...item,
      subCategories: item?.subcategories?.join(", ") || "", // Convert subcategories array to comma-separated string
    }));
  };

  // Apply filtering to the transformed data
  const filteredData = useMemo(() => {
    switch (selectedButton) {
      case "All":
        return transformData(list); // Transform the entire list
      case "Active":
        return transformData(list.filter((item) => item.status === "Active"));
      case "Inactive":
        return transformData(list.filter((item) => item.status === "Inactive"));
      default:
        return []; // Return an empty array for unknown button values
    }
  }, [list, selectedButton]);

  const renderComponent = () => {
    if (loading) {
      return smallSpinner();
    } else if (filteredData.length === 0) {
      return (
        <div className="flex justify-center pt-20 items-center bg-transparent text-red-400">
          No data available.
        </div>
      );
    } else {
      return (
        <Table data={filteredData} columns={columns} fetchData={fetchData} />
      );
    }
  };

  const handleAddCategories = () => {
    navigate("/admin/add-categories");
  };

  const smallSpinner = () => {
    return (
      <div className="w-full h-[250px] flex justify-center items-center mt-2 overflow-auto">
        <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchData();
    }
  };

  return (
    <div className="w-full h-screen bg-blue-50 px-4 ">
      <div className="bg-white mt-3 h-14 rounded-2xl flex justify-between">
        <h1 className="p-3 text-2xl font-bold font-santoshi">Categories</h1>
        <button
          className="bg-blue-900 text-white px-10 m-2 rounded-2xl cursor-pointer"
          onClick={handleAddCategories}
        >
          Add Categories
        </button>
      </div>

      <div className="flex flex-col pt-5">
        <div className="flex"></div>
        <div className="w-full mt-3">
          {DropDownList.map((value, key) => (
            <div key={key} className="inline-block focus:outline-none">
              <button
                type="button"
                className={`py-2 font-bold font-santoshi px-6 ${
                  selectedButton === value
                    ? "text-white bg-blue-900"
                    : "border-blue-900 border-r-2 bg-white text-blue-900"
                }`}
                onClick={() => setSelectedButton(value)}
              >
                {value}
              </button>
            </div>
          ))}
        </div>
        {renderComponent()}

        <div className="flex justify-center items-center pt-5 space-x-4">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
