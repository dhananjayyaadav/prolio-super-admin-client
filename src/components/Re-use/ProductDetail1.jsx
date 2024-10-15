import React, { useState } from "react";

function ProductDetails1({ data }) {
  return (
    <>
      <div className="w-full">
        <div className="bg-transparent">
          {data &&
            data.map((question, index) => (
              <>
                {question.type !== "file" ? (
                  <div
                    key={index}
                    className="md:py-2 pt-2 w-full flex bg-white"
                  >
                    <div className="font-semibold w-1/2  md:px-6 text-left md:text-base text-sm bg-white">
                      {question.description}
                    </div>
                    <div className="font-normal w-1/2 bg-white px-3">
                      {question.value || ""}
                    </div>
                  </div>
                ) : null}
              </>
            ))}
        </div>
      </div>
    </>
  );
}

export default ProductDetails1;
