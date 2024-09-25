import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCirclePlus } from "react-icons/ci";
import { MdCancel, MdEdit } from "react-icons/md";
import axios from "axios";

function AddBannerComponent() {
  const [banners, setBanners] = useState([]);
  const [files, setFiles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [textColors, setTextColors] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;

  const handleAddBanner = () => {
    if (banners.length >= 4) {
      toast.error("You can only upload up to 4 banner images.");
      return;
    }
    document.getElementById("fileInput").click();
  };

  useEffect(() => {
    return () => {
      banners.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [banners]);

  const handleFileChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const validExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        toast.error("Only image files (jpg, jpeg, png, gif) are allowed!");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width >= 1100 && img.height >= 320) {
          const fileUrl = img.src;
          setBanners((prevBanners) => [...prevBanners, fileUrl]);
          setFiles((prevFiles) => [...prevFiles, file]);
          setDescriptions((prevDescriptions) => [...prevDescriptions, ""]); // Initialize empty description
          toast.success("Image loaded and dimensions are correct!");
        } else {
          URL.revokeObjectURL(img.src);
          toast.error("Image dimensions must be 1132px by 343px!");
        }
      };
      img.onerror = () => {
        toast.error("Error loading image file.");
      };
    }
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };
  const toggleEditMode = (index) => {
    setEditMode((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(banners[indexToRemove]);
    const updatedBanners = banners.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedDescriptions = descriptions.filter(
      (_, index) => index !== indexToRemove
    );

    setBanners(updatedBanners);
    setFiles(updatedFiles);
    setDescriptions(updatedDescriptions);
    setEditMode((edit) => {
      const newEdit = { ...edit };
      delete newEdit[indexToRemove];
      return newEdit;
    });
  };

  const uploadBanners = async () => {
    if (files.length === 0 || descriptions.some((desc) => desc.trim() === "")) {
      toast.info(
        "Please upload at least one image and provide a description for each!"
      );
      return;
    }
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("banners", file);
      formData.append("descriptions", descriptions[index]); // Append description
      formData.append("colors", textColors[index] || "#FFFFFF"); // Append text color, default to white if not set
    });

    try {
      const response = await axios.post(
        `${apiURL}/superAdmin/add-banners`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.message);
      setFiles([]);
      setDescriptions([]);
      setTextColors([]);
      setBanners([]);
      setTextColors([]);
    } catch (error) {
      console.error("Error uploading data:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
      }
    }
  };

  const handleColorChange = (index, color) => {
    const updatedColors = [...textColors];
    updatedColors[index] = color;
    setTextColors(updatedColors);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between">
        <div
          className="border w-52 h-20 bg-blue-900 m-5 flex justify-center items-center rounded-2xl shadow-md border-blue-900 focus:outline-blue-900"
          onClick={handleAddBanner}
        >
          <h1 className="font-santoshi font-semibold flex items-center gap-2 text-white cursor-pointer">
            <CiCirclePlus className="text-2xl hover:text-white font-bold rounded-2xl" />{" "}
            Add Banner
          </h1>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="pt-2">
          <button
            className="bg-blue-900 px-4 py-2 rounded-lg text-white font-santoshi"
            onClick={uploadBanners}
          >
            Upload Banner
          </button>
        </div>
      </div>
      {banners.map((src, index) => (
        <div
          className="flex flex-col relative justify-center items-center w-full h-72 bg-white border rounded-2xl shadow-md border-blue-900 focus:outline-blue-900 my-4"
          key={index}
        >
          <img
            src={src}
            alt={`Banner ${index}`}
            className="w-full h-full object-cover rounded-2xl relative"
          />
          {editMode[index] ? (
            <textarea
              value={descriptions[index]}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="w-72 h-24 absolute top-16 left-5 p-3 rounded-lg focus:outline-blue-900 z-10"
              style={{ color: textColors[index] || "black" }}
            />
          ) : (
            <p
              className="absolute  left-5 p-3 w-72 bg-transparent font-semibold font-santoshi line-clamp-3 leading-tight text-2xl bg-opacity-50 rounded-lg z-10"
              style={{ color: textColors[index] || "black" }}
            >
              {descriptions[index] || "No description"}
            </p>
          )}
          <span
            className="absolute bottom-20 left-5 text-blue-900 z-10 font-semibold font-santoshi"
            style={{ display: editMode[index] ? "block" : "none" }}
          >
            Select Description color
          </span>
          <input
            type="color"
            value={textColors[index] || "#FF0000"}
            onChange={(e) => handleColorChange(index, e.target.value)}
            className="absolute bottom-10 left-5 m-2 bg-transparent z-10"
            title="Change text color"
            style={{ display: editMode[index] ? "block" : "none" }} // Show color picker only in edit mode
          />
          <button
            onClick={() => toggleEditMode(index)}
            className="absolute top-0 left-0 text-white bg-blue-900 rounded-md p-2 m-2 shadow-lg font-santoshi cursor-pointer hover:bg-blue-800 z-20"
            title={editMode[index] ? "Save" : "Edit"}
          >
            {editMode[index] ? "Save" : <MdEdit size="24px" />}
          </button>
          <button
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1 m-2 shadow-lg cursor-pointer hover:bg-red-100 z-20"
            title="Remove image"
          >
            <MdCancel size="24px" />
          </button>
        </div>
      ))}

      <ToastContainer />
    </div>
  );
}

export default AddBannerComponent;
