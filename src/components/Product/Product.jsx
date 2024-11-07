import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { useSelector } from "react-redux";
// import ProductCardComponent from "./ProductCardComponent";
// import ProductList from "./ProductList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./ProductList";

function Product() {
  //   const token = useSelector((state) => state.token.token);
  // const navigate = useNavigate();
  const DropDownList = [
    "All Products",
    "Processing",
    "Removed Products",
    "Draft",
  ];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiURL}/superAdmin/getall-product`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      //   console.log(response.data, "fffff");
      setLoading(false);

      setList(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductListByStatus = (status) => {
    return list?.filter((item) => item.status === status.toLowerCase());
  };

  const renderComponent = () => {
    if (loading) {
      return smallSpiner();
    }

    if (!list?.length) {
      return (
        <div className="flex justify-center items-center bg-transparent text-red-400">
          No data available.
        </div>
      );
    }

    const statusMap = {
      "All Products": list,
      "My Products": "approved",
      Draft: "draft",
      Processing: "processing",
      "Removed Products": "block",
    };

    const data =
      statusMap[selectedButton] === list
        ? list
        : getProductListByStatus(statusMap[selectedButton]);

    return (
      <ProductList list={data}  header={selectedButton} onSubmit={fetchData} />
    );
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
      <div className="w-full">
        <div className="flex justify-between  m-2">
          <h1 className="font-santoshi text-xl  font-semibold text-blue-900">
            Product
          </h1>
        </div>

        <div className="w-full flex flex-col  bg-transparent  ">
          <div className="w-full ">
            {DropDownList.map((value, key) => {
              return (
                <div key={key} className="font-santoshi inline-block">
                  <button
                    type="button"
                    className={` font-semibold px-6 ${
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
        </div>

        {/* Search Sections */}
        {/* <div className="menu-main-container " ref={menuRef}>
        <div
          className="menu-main-container-items"
          onClick={toggleCategoryOptions}
        >
          <div>Category</div>
          <div className="dropdown">
            {categoryOptionsOpen ? (
              <ExpandLessIcon onClick={toggleCategoryOptions} />
            ) : (
              <ExpandMoreIcon onClick={toggleCategoryOptions} />
            )}
            {categoryOptionsOpen && (
              <div className="dropdown-content">
                {categoryOptions.map((item) => (
                  <p>{item}</p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="menu-main-container-items"
          onClick={toggleSubCategoryOptions}
        >
          <div>Sub Category</div>
          <div className="dropdown">
            {subCategoryOptionsOpen ? (
              <ExpandLessIcon onClick={toggleSubCategoryOptions} />
            ) : (
              <ExpandMoreIcon onClick={toggleSubCategoryOptions} />
            )}
            {subCategoryOptionsOpen && (
              <div className="dropdown-content">
                {subCategoryOptions.map((item) => (
                  <p>{item}</p>
                ))}
              </div>
            )}
          </div>
        </div>
       
        <div className="menu-main-container-items">
          <div>From:</div>
          <input
            type="date"
            name=""
            id=""
            className="bg-blue-50 border rounded focus:outline-blue-900 cursor-pointer"
          />
        </div>
        <div className="menu-main-container-items">
          <div>To:</div>
          <input
            type="date"
            name=""
            id=""
            className="bg-blue-50 border rounded focus:outline-blue-900 cursor-pointer"
          />
        </div>
      </div> */}

        {renderComponent()}
      </div>
      <ToastContainer className="bg-transparent" />
    </>
  );
}

export default Product;
