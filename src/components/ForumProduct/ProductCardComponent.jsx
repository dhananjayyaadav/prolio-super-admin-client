import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCardComponent({ data }) {
  const navigate = useNavigate();

  const productData = data;
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <>
      <div className=" w-[1000px] h-[400px] overflow-auto pb-5 mt-3 shadow-md rounded-lg p-5 bg-white">
        <div className="grid px-5 grid-cols-1 bg-transparent md:grid-cols-3 gap-3 ">
          {productData?.map((product, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/viewproduct/${product.id}`);
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className=" bg-transparent w-full min-h-[10rem] rounded-lg shadow-xl cursor-pointer  overflow-hidden"
            >
              <div className="relative w-full h-[150px] ">
                {/* Primary Image */}
                <img
                  src={product.productImage}
                  alt={`Product Image of ${product.productName}`}
                  className={`absolute inset-0 w-full h-full object-contain mt-2 transition-opacity duration-300 ease-in-out ${
                    hoverIndex === index ? "opacity-0" : "opacity-100"
                  }`}
                />
                {/* Secondary Image */}
                <img
                  src={product.secondaryProductImage}
                  alt={`Secondary Image of ${product.productName}`}
                  className={`absolute inset-0 w-full h-full object-contain  mt-2 transition-opacity duration-300 ease-in-out ${
                    hoverIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="p-5 flex-col gap-3">
                <h1 className="font-bold text-lg text-black overflow-hidden overflow-ellipsis">
                  {product?.productName}
                </h1>
                <div className="pt-3 text-blue-900 font-semibold">
                  <span className="text-lg text-blue-900 block">
                    By {product?.brandName}
                  </span>
                  <p className="mt-2 font-bold">
                    Price : ₹ {product?.productPrice}{"400"}
                    {/* {product.sections2?.variantFields[0]?.mrpValue || ""}  */}
                    piece
                  </p>
                </div>
                <div className="w-full pt-3">
                  <button className="bg-blue-900 h-10 rounded-xl text-white font-semibold w-full">
                    Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductCardComponent;
