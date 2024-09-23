import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { useSelector } from "react-redux";
// import ProductCardComponent from "./ProductCardComponent";
// import ProductList from "./ProductList";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BannerList from "./BannerList";
import AddBannerComponent from "./AddBannerComponent";

function BannerManagement() {
  const DropDownList = ["Active", "Inactive", "Add Banners"];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/superAdmin/get-all-banners`);
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setLoading(false);
      toast.error("Failed to fetch banners."); // Using toast for error messages
    }
  };

  useEffect(() => {
    fetchData();
  }, []); //

  const renderComponent = () => {
    if (loading) {
      return smallSpiner();
    }
    // if (!banners.length) {
    //   return (
    //     <div className="flex justify-center items-center bg-transparent text-red-400">
    //       No data available.
    //     </div>
    //   );
    // }
    if (selectedButton === "Active") {
      return <BannerList list={banners} header={selectedButton} onSubmit={fetchData}/>;
    } else if (selectedButton === "Inactive") {
      return <BannerList list={banners} header={selectedButton} onSubmit={fetchData}/>;
    } else if (selectedButton === "Add Banners") {
      return <AddBannerComponent />;
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
      <div className="w-full h-full pt-3">
        <div className="flex justify-between  ">
          <h1 className="font-santoshi text-xl  font-semibold text-blue-900">
            Banner Management
          </h1>
        </div>

        <div className="w-full flex flex-col  bg-transparent  pt-10">
          <div className="w-full ">
            {DropDownList.map((value, key) => {
              return (
                <div key={key} className="font-santoshi inline-block">
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
                </div>
              );
            })}
          </div>

          <div className="pt-2 w-full px-5 bg-transparent">
            <hr className=" border-gray-400 bg-transparent" />
          </div>
        </div>

        {/* Search Sections */}

        {renderComponent()}
      </div>
      <ToastContainer className="bg-transparent" />
    </>
  );
}

export default BannerManagement;
