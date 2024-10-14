import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductCardComponent from "./ProductCardComponent";
import ProductList from "./ProductList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductGrid from "./ProductGrid";

function ProductListPage() {
  const token = useSelector((state) => state.token.token);
  const DropDownList = [
    "All Products",
    // "My Products",
    // "Processing",
    // "Removed Products",
    // "Draft",
  ];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [list, setList] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/product/getall-product`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);
        setProductData(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedButton]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/product/getproductbyUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

    if (!productData?.length) {
      return (
        <div className="flex justify-center items-center bg-transparent text-red-400">
          No data available.
        </div>
      );
    }

    const statusMap = {
      "All Products": productData,
      "My Products": "approved",
      Draft: "draft",
      Processing: "processing",
      "Removed Products": "block",
    };

    const data =
      statusMap[selectedButton] === productData
        ? productData
        : getProductListByStatus(statusMap[selectedButton]);

    return selectedButton === "All Products" ? (
      <ProductGrid products={data} />
    ) : (
      <ProductList list={data} header={selectedButton} onSubmit={fetchData} />
    );
  };

  const smallSpiner = () => {
    return (
      <div className="w-full h-[250px] flex justify-center items-center mt-2 overflow-auto">
        <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center m-2">
          <h1 className="font-santoshi text-xl pt-3 font-semibold text-blue-900">
            Products
          </h1>

          <Link to="/admin/addproduct">
            <button className="items-center rounded-lg p-2 text-lg border bg-blue-900 text-white">
              Share Product
            </button>
          </Link>
        </div>

        <div className="w-full flex flex-col bg-transparent">
          <div className="w-full">
            {DropDownList.map((value, key) => {
              return (
                <div key={key} className="font-santoshi inline-block">
                  <button
                    type="button"
                    className={`py-2 font-semibold px-6 ${
                      selectedButton === value
                        ? "text-blue-800 border-b-2 border-blue-900"
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

          {/* <div className="pt-2 w-full px-5 bg-transparent">
            <hr className="border-gray-400 bg-transparent" />
          </div> */}
        </div>
        {renderComponent()}
      </div>
      <ToastContainer className="bg-transparent" />
    </>
  );
}

export default ProductListPage;
