import React from "react";

function SocialComponent({ data }) {
  return (
    <>
      <div className="w-full py-3 bg-white">
        {data?.map((item) => {
          if (item.description === "Social Media Handles") {
            return (
              <div className="bg-transparent" key={item.id}>
                {/* <h3 className="bg-transparent">{item.description}</h3> */}
                {item?.attributes.map((attribute, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-left bg-white">
                      {attribute?.name}:
                      <span className="font-semibold px-3 underline bg-white">
                        {attribute?.value}
                      </span>
                    </h5>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

export default SocialComponent;
