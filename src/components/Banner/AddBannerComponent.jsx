import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";
import { MdCancel, MdEdit, MdCloudUpload } from "react-icons/md";
import api from "../../services/axios";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Image as ImageIcon,
  Check,
} from "lucide-react";

function AddBannerComponent() {
  const [banners, setBanners] = useState([]);
  const [files, setFiles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [textColors, setTextColors] = useState([]);

  const handleAddBanner = () => {
    if (banners.length >= 10) {
      Swal.fire({
        icon: "warning",
        title: "Upload Limit Exceeded",
        text: "You can only upload up to 10 banner images.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const validFiles = newFiles.filter((file) => {
      const validExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return validExtensions.includes(fileExtension);
    });

    const fileProcessPromises = validFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width >= 1100 && img.height >= 320) {
            resolve({ file, url: img.src });
          } else {
            URL.revokeObjectURL(img.src);
            reject(new Error(`Invalid dimensions for ${file.name}`));
          }
        };
        img.onerror = () => reject(new Error(`Error loading ${file.name}`));
      });
    });
    Promise.allSettled(fileProcessPromises).then((results) => {
      const successfulUploads = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const failedUploads = results
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason);

      if (successfulUploads.length > 0) {
        const newBannerUrls = successfulUploads.map((upload) => upload.url);
        const newFiles = successfulUploads.map((upload) => upload.file);

        setBanners((prev) => [...prev, ...newBannerUrls]);
        setFiles((prev) => [...prev, ...newFiles]);
        setDescriptions((prev) => [...prev, ...newFiles.map(() => "")]);
        setTextColors((prev) => [...prev, ...newFiles.map(() => "#000000")]);

        toast.success("Images loaded successfully!");
      }

      if (failedUploads.length > 0) {
        toast.error(
          `${failedUploads.length} upload(s) failed. Check dimensions (1132px by 343px) or other issues.`
        );
      }
    });
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
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this banner image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        URL.revokeObjectURL(banners[indexToRemove]);
        const updatedBanners = banners.filter(
          (_, index) => index !== indexToRemove
        );
        const updatedFiles = files.filter(
          (_, index) => index !== indexToRemove
        );
        const updatedDescriptions = descriptions.filter(
          (_, index) => index !== indexToRemove
        );
        const updatedTextColors = textColors.filter(
          (_, index) => index !== indexToRemove
        );

        setBanners(updatedBanners);
        setFiles(updatedFiles);
        setDescriptions(updatedDescriptions);
        setTextColors(updatedTextColors);
        setEditMode((edit) => {
          const newEdit = { ...edit };
          delete newEdit[indexToRemove];
          return newEdit;
        });
      }
    });
  };

  const handleColorChange = (index, color) => {
    const updatedColors = [...textColors];
    updatedColors[index] = color;
    setTextColors(updatedColors);
  };

  const uploadBanners = async () => {
    if (files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Images",
        text: "Please add at least one banner image.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    Swal.fire({
      title: "Confirm Upload",
      text: `You are about to upload ${files.length} banner(s)`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upload!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("bannerImgs", file);
        });

        formData.append("description", JSON.stringify(descriptions));
        formData.append("colors", JSON.stringify(textColors));
        formData.append("status", "active");

        try {
          const response = await api.post(
            `/admin/banner/create-banner`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          Swal.fire({
            icon: "success",
            title: "Upload Successful",
            text: response.data.data,
            confirmButtonColor: "#3085d6",
          });

          setFiles([]);
          setDescriptions([]);
          setTextColors([]);
          setBanners([]);
          setEditMode({});
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: error.response?.data?.error || "Something went wrong",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-100 p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div
            className="w-full sm:w-auto flex items-center justify-center sm:justify-start"
            onClick={handleAddBanner}
          >
            <div className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center gap-2 cursor-pointer transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Banner</span>
            </div>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              multiple
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
          </div>

          <button
            className="w-full sm:w-auto bg-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            onClick={uploadBanners}
          >
            <Upload className="w-5 h-5" />
            <span>Upload Banners</span>
          </button>
        </div>

        {/* Banners Grid */}
        {banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <ImageIcon className="w-20 h-20 mb-4" />
            <p className="text-lg text-center">No banners uploaded yet</p>
            <p className="text-sm text-center">
              Click "Add Banner" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
            {banners.map((src, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-[1.02]"
              >
                {/* Banner Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={src}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Description Section */}
                <div className="p-3 sm:p-4">
                  {editMode[index] ? (
                    <textarea
                      value={descriptions[index]}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-200 transition-all"
                      style={{ color: textColors[index] || "black" }}
                      placeholder="Enter banner description"
                    />
                  ) : (
                    <p
                      className="text-sm font-medium line-clamp-2"
                      style={{ color: textColors[index] || "black" }}
                    >
                      {descriptions[index] || "No description"}
                    </p>
                  )}

                  {/* Color Picker for Edit Mode */}
                  {editMode[index] && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">Text Color:</span>
                        <input
                          type="color"
                          value={textColors[index] || "#000000"}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                          className="w-10 h-10 rounded-full p-1 border"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => toggleEditMode(index)}
                    className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                    title={editMode[index] ? "Save" : "Edit"}
                  >
                    {editMode[index] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AddBannerComponent;
