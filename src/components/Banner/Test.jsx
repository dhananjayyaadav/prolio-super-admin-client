import React, { useEffect, useRef } from "react";
import "./Test.css";

function Test() {
  const imgUrl =
    "https://imgs.search.brave.com/oIc-hfji4QOrtWTnKiEvf6S91NAq5zfD_3R5--UIwq0/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzRiNi9tb2Rl/bC0zLTE0MzM0ODMu/anBnP2ZtdA";

  const cartItemRef = useRef(null);
  const zoomDivRef = useRef(null);
  const zoomedImgRef = useRef(null);

  useEffect(() => {
    const cartItem = cartItemRef.current;
    const zoomDiv = zoomDivRef.current;
    const zoomedImg = zoomedImgRef.current;

    const handleMouseMove = (e) => {
      zoomDiv.style.display = "block";
      const rect = cartItem.getBoundingClientRect(); // Gets the element's size and position
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      zoomedImg.style.transform = `translate3d(-${rect.width * 3.5 * x}px, -${
        rect.height * y
      }px, 0px)`;
    };

    const handleMouseLeave = () => {
      zoomDiv.style.display = "none";
    };

    if (cartItem) {
      cartItem.addEventListener("mousemove", handleMouseMove);
      cartItem.addEventListener("mouseleave", handleMouseLeave);
    }

    // Clean up the event listeners when the component unmounts
    return () => {
      if (cartItem) {
        cartItem.removeEventListener("mousemove", handleMouseMove);
        cartItem.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="flex">
      <img ref={cartItemRef} src={imgUrl} alt="" className="cart_item" />
      <div ref={zoomDivRef} className="zoom">
        <img ref={zoomedImgRef} src={imgUrl} alt="" />
      </div>
    </div>
  );
}

export default Test;
