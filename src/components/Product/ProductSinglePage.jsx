import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import wishlistIcon from "../../assets/wishlisticon.png";
import shareIcone from "../../assets/shareIcon.png";
import { IoEyeSharp } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import SocialComponent from "./SocialComponent";

import cross from "../../assets/cross.png";
import { Link } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import ProductDetails1 from "../Re-use/ProductDetail1";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function ProductSinglePage({ id: propId, onClose, headers }) {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [productImage, setProductImage] = useState([]);
  const [finishedProductImages, setFinishedProductImages] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;

  const DropDownList = [
    "Product Details",
    "Social Media Handles",
    "Business Booster",
    "Pricing",
  ];
  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);

  const [value, setValue] = useState(0);
  const activeImage = productImage[value];

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/product/getProductById/${id}`,
          { headers }
        );

        setProductImage(response.data?.productImages || []);
        setFinishedProductImages(response.data?.finishedProductImages || []);
        setData(response.data?.data || {});
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderComponent = () => {
    switch (selectedButton) {
      case "Product Details":
        return (
          <ProductDetails1 data={data?.questions?.steps[0]?.questions || ""} />
        );
      case "Social Media Handles":
        return (
          <SocialComponent data={data?.questions?.steps[3]?.questions || ""} />
        );
      case "Pricing":
        return (
          <VariationComponents
            data={data?.questions?.steps[1]?.questions || ""}
          />
        );

      default:
        return null;
    }
  };

  function renderButtons(data) {
    const status = data;

    if (status === "block") {
      return (
        <button
          className="bg-white text-green-600 border border-green-600 py-2 font-semibold w-full rounded-md"
          onClick={() => handleBlock("approved")}
        >
          UnBlock
        </button>
      );
    } else if (status === "processing") {
      return (
        <>
          <button
            className="bg-white text-red-600 border border-red-600 py-2 font-semibold w-full rounded-md"
            onClick={() => handleBlock("block")}
          >
            Block
          </button>
          <button
            className="bg-white text-green-600 border border-green-600 py-2 font-semibold w-full rounded-md mt-2"
            onClick={() => handleBlock("approved")}
          >
            Approve
          </button>
        </>
      );
    } else {
      return (
        <button
          className="bg-white text-red-600 border border-red-600 py-2 font-semibold w-full rounded-md"
          onClick={() => handleBlock("block")}
        >
          Block
        </button>
      );
    }
  }

  const smallSpiner = () => {
    return (
      <>
        <div className="w-full h-[250px]  flex justify-center items-center mt-2 overflow-auto">
          <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
        </div>
      </>
    );
  };

  // const handleBlock = async (status) => {
  //   try {
  //     const res = await axios.put(
  //       `${apiURL}/product/changeStatus/${id}`,
  //       {
  //         status: status,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     toast.success(`Product ${res.data} Successfully`);
  //     onClose();
  //   } catch (error) {
  //     toast.error(error.message);
  //     // onClose();
  //   }
  // };

  const handleBlock = async (status) => {
    try {
      // First show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${status} this product?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await axios.put(
          `${apiURL}/product/changeStatus/${id}`,
          {
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Product ${res.data} Successfully`,
          timer: 1500,
        });
      }
    } catch (error) {
      // Show error message
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <>
      {loading ? (
        smallSpiner()
      ) : (
        <>
          <div className="mt-2 bg-blue-50 ">
            {data?.status === "draft" && (
              <div className="bg-transparent">
                <p className="text-red-600 px-5 bg-white border border-red-600">
                  Please complete All Steps to add product in inventory By
                  clicking Edit button
                </p>
              </div>
            )}
            <div className="bg-transparent flex justify-between items-center gap-4">
              <div className="flex gap-2 items-center">
                <Icon
                  icon="oui:arrow-left"
                  className="bg-blue-900 text-white text-xl cursor-pointer"
                  onClick={onClose}
                />
                <h1 className="text-lg text-blue-900 font-semibold bg-transparent font-santoshi">
                  {headers}
                </h1>
              </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-2 p-2">
              <div className="lg:w-4/5 h-[400px] lg:overflow-auto">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Image Gallery */}
                  <div className="flex md:flex-col gap-x-2 h-28">
                    {productImage.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Image ${index}`}
                        className="w-24 h-full rounded-md py-1 bg-transparent cursor-pointer"
                        onClick={() => setValue(index)}
                      />
                    ))}
                  </div>
                  <div className="md:w-[300px] md:h-[400px] object-contain">
                    <img
                      src={activeImage}
                      alt="activeImage"
                      className="w-full h-full rounded-md object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="lg:w-1/2 w-full flex flex-col gap-3">
                    {/* Product header and actions */}
                    <div className="flex justify-between">
                      <h1 className="text-xl font-bold">
                        {data?.questions?.steps[0]?.questions[0].value || ""}
                      </h1>
                      <div className="flex gap-4 items-center">
                        <img
                          className="w-7 h-7 cursor-pointer"
                          src={wishlistIcon}
                          alt="wishlistIcon"
                        />
                        <img
                          className="w-7 h-7"
                          src={shareIcone}
                          alt="shareIcon"
                        />
                      </div>
                    </div>
                    {/* Brand and Description */}
                    {data?.questions?.steps[0]?.questions[1].value && (
                      <span className="font-semibold text-blue-900">
                        By{" "}
                        {data?.questions?.steps[0]?.questions[1]?.value || ""}
                      </span>
                    )}
                    <p className="text-gray-700">
                      {data?.questions?.steps[0]?.questions[5]?.value}
                      {data?.questions?.steps[0]?.questions[6]?.value}
                    </p>
                    {/* Price */}
                    <h6 className="text-xl text-blue-900 font-semibold">
                      Price: ₹{" "}
                      {data?.questions?.steps[1]?.questions[0]?.cards[4]
                        ?.value || ""}{" "}
                      per piece
                    </h6>
                    {/* Variations */}
                    {data?.sections1?.variation && (
                      <>
                        <h6 className="text-xl font-semibold">Variations:</h6>
                        <div className="flex gap-6">
                          {/* Colors */}
                          <div className="flex flex-col">
                            <span className="font-semibold">Colors</span>
                            <div className="w-52 h-24 bg-white shadow-md mt-1 rounded-md"></div>
                          </div>
                          {/* Sizes */}
                          <div className="flex flex-col">
                            <span className="font-semibold">Sizes</span>
                            <div className="w-52 h-24 bg-white shadow-md mt-1 rounded-md"></div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Send Inquiry Button */}
                    <div className="pt-4">
                      <button
                        disabled
                        className="bg-gray-300 text-black font-semibold w-full py-3 rounded-md cursor-not-allowed"
                      >
                        Send Enquiry
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/5 md:px-5 md:hidden my-6 md:mt-0">
                  <div className="md:w-28  bg-transparent  items-center ">
                    <div className="w-full  bg-transparent  items-center  mt-2">
                      {renderButtons(data?.status)}
                    </div>
                  </div>

                  {/* </div> */}
                  <div className="flex md:flex-col md:justify-between justify-center  gap-x-3 md:pl-10">
                    <div className="flex justify-center items-center flex-col  mt-2 w-full sm:w-1/3">
                      <div className="md:w-32 md:h-28 px-6 py-3 md:px-0 md:py-0 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                        <div className="flex flex-col items-center">
                          <IoEyeSharp className="text-white text-2xl" />
                          <span className="text-white font-santoshi text-sm">
                            Views
                          </span>
                          <h1 className="text-white font-semibold text-xl">
                            5488
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center flex-col mt-2 w-full sm:w-1/3">
                      <div className="md:w-32 md:h-28 px-6 py-3 md:px-0 md:py-0 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                        <div className="flex flex-col items-center">
                          <RiShareForwardLine className="text-white text-2xl" />
                          <span className="text-white font-santoshi text-sm">
                            Share
                          </span>
                          <h1 className="text-white font-semibold text-xl">
                            5488
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center flex-col mt-2 w-full sm:w-1/3">
                      <div className="md:w-32 md:h-28 px-6 py-3 md:px-0 md:py-0 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                        <div className="flex flex-col items-center">
                          <FaPeopleGroup className="text-white text-2xl" />
                          <span className="text-white font-santoshi text-sm">
                            Enquiries
                          </span>
                          <h1 className="text-white font-semibold text-xl">
                            5488
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="m-3 h-max bg-white mt-14">
                  {/* Dropdown List */}
                  <div className="w-full grid md:grid-flow-col grid-flow-row grid-cols-4 border-[1px] rounded-lg">
                    {DropDownList.map((value, key) => (
                      <button
                        key={key}
                        type="button"
                        className={`border-x-[1px] py-2 text-sm md:text-base md:font-semibold ${
                          selectedButton === value
                            ? "bg-blue-900 text-white"
                            : "bg-white text-gray-500"
                        }`}
                        onClick={() => setSelectedButton(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  {renderComponent()}
                </div>
              </div>

              <div className="md:w-1/5 px-5 hidden md:block my-6 md:mt-0">
                <div className="md:w-28  bg-transparent  items-center ">
                  <div className="w-full  bg-transparent  items-center  mt-2">
                    {renderButtons(data?.status)}
                  </div>
                </div>

                {/* </div> */}
                <div className="flex md:flex-col md:justify-between justify-center  gap-x-3 md:pl-10">
                  <div className="flex justify-center items-center flex-col  mt-2 w-full sm:w-1/3">
                    <div className="w-32 h-28 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                      <div className="flex flex-col items-center">
                        <IoEyeSharp className="text-white text-2xl" />
                        <span className="text-white font-santoshi text-sm">
                          Views
                        </span>
                        <h1 className="text-white font-semibold text-xl">
                          5488
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col mt-2 w-full sm:w-1/3">
                    <div className="w-32 h-28 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                      <div className="flex flex-col items-center">
                        <RiShareForwardLine className="text-white text-2xl" />
                        <span className="text-white font-santoshi text-sm">
                          Share
                        </span>
                        <h1 className="text-white font-semibold text-xl">
                          5488
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col mt-2 w-full sm:w-1/3">
                    <div className="w-32 h-28 bg-blue-900 flex justify-center items-center rounded-2xl mt-2">
                      <div className="flex flex-col items-center">
                        <FaPeopleGroup className="text-white text-2xl" />
                        <span className="text-white font-santoshi text-sm">
                          Enquiries
                        </span>
                        <h1 className="text-white font-semibold text-xl">
                          5488
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductSinglePage;
