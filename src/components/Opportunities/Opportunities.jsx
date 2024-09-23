import React, { useEffect, useMemo, useState } from "react";
// import Table from "../Re-use/Table";
import axios from "axios";
import OpportunitiesTable from "./OpportunitiesTable";
// import { useSelector } from "react-redux";

function Opportunities() {
  const [newlist, setNewList] = useState([]);

  const DropDownList = ["Authorized Service center", "Supplier", "Dealer"];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
//   const token = useSelector((state) => state.token.token);
  const [loading, setLoading] = useState(true);

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/superAdmin/get-All-opportunities`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        );
            console.log(response.data);
        const newData = response.data.map((item) => ({
          vendorName: `${item.userId.firstName} ${item.userId.lastName}`,
          productId: "QWWE1245",
          appliedDate: new Date(item.createdAt).toLocaleDateString(),
          _id: item._id,
          status: item.status,
        }));
        setNewList(newData);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(() => newlist, [newlist]);

  const columns = [
    {
      header: "Vendor Name",
      accessorKey: "vendorName",
    },
    {
      header: "Product ID ",
      accessorKey: "productId",
    },
    {
      header: "Appled Date",
      accessorKey: "appliedDate",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
  ];

  const renderComponent = () => {
    if (loading) {
      return smallSpiner();
    } else if (newlist?.length === 0) {
      return (
        <div className="flex justify-center pt-20 items-center bg-transparent text-red-400">
          No data available.
        </div>
      ); // Render message when list is empty
    } else if (selectedButton === "Authorized Service center") {
      return <OpportunitiesTable data={data} columns={columns} />;
    // } else if (selectedButton === "Supplier") {
    //   return <Table data={data} columns={columns} />;
    // } else if (selectedButton === "Dealer") {
    //   return <Table data={data} columns={columns} />;
    // } 
    }else {
      return null;
    }
  };

  const smallSpiner = () => {
    return (
      <>
        <div className="w-full h-[250px] flex justify-center items-center mt-2 overflow-auto">
          <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="bg-transparent">
        <h1 className="text-2xl  px-5 text-blue-800 font-semibold">
          Opportunities
        </h1>

        <div className="w-auto flex flex-col ">
          <div className="w-full relative">
            {DropDownList.map((value, key) => {
              return (
                <div key={key} className="relative inline-block">
                  <button
                    type="button"
                    className={`py-2 font-semibold px-6 ${
                      selectedButton === value
                        ? "text-blue-800 border-blue-900"
                        : "bg-transparent text-gray-500"
                    }`}
                    onClick={() => setSelectedButton(value)}
                  >
                    {value}
                  </button>
                  {selectedButton === value && (
                    <hr
                      className="absolute mx-6 border-t-2 border-blue-900"
                      style={{ width: `${value.length}ch`, bottom: "-2px" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 w-[1050px] px-5">
            <hr className="border border-gray-400" />
          </div>
        </div>
      </div>
      {renderComponent()}
    </>
  );
}

export default Opportunities;
