import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import deleteIcon from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";

function RowDetails({ data, onClose }) {
  const handleOnClose = () => {
    onClose();
  };

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleOnClick = () => {
    setShowRejectModal(true);
  };
  const openFullscreen = (url) => {
    setSelectedImage(url);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };
  const handleClose = () => {
    setShowRejectModal(false);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const accordionData = [
    {
      title: "Company Information",
      content: (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Company Name</p>
            <span className="font-semibold">{data.companyName}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Owner Name</p>
            <span className="font-semibold">{data.OwnerName}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Place</p>
            <span className="font-semibold">{data.state}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">GST Number</p>
            <span className="font-semibold">{data.registrationNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Business Type</p>
            <span className="font-semibold">{data.businessType}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Year of Establishment</p>
            <span className="font-semibold">{data.yearOfRegister}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Total Employees</p>
            <span className="font-semibold">{data.totalEmployees}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Company Email</p>
            <span className="font-semibold">{data.companyEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Contact Number</p>
            <span className="font-semibold">{data.contactNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Address</p>
            <span className="font-semibold">
              {data.address1} {data.address2}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">City</p>
            <span className="font-semibold">{data.city}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">Zip Code</p>
            <span className="font-semibold">{data.zipCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-santoshi m-0">State</p>
            <span className="font-semibold">{data.state}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Documents",
      content: (
        <div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.documents?.map((document, index) => (
              <li key={index} className="flex flex-col items-center">
                {document?.url?.endsWith(".pdf") ? (
                  <div className="flex flex-col items-center">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex flex-col items-center"
                    >
                      <div className="w-28 h-24 bg-red-100 flex items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <span className="text-3xl font-bold text-red-500">
                          PDF
                        </span>
                      </div>
                      {/* <p className="mt-2 text-sm text-center truncate w-28">
                        {document.fileKey.split("/").pop()}
                      </p> */}
                    </a>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-500 hover:underline text-sm"
                    >
                      View File
                    </a>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => openFullscreen(document.url)}
                  >
                    <img
                      src={document.url}
                      alt={document.fileKey}
                      className="w-28 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                    {/* <p className="mt-2 text-sm text-center truncate w-28">
                      {document.fileKey.split("/").pop()}
                    </p> */}
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-500 hover:underline text-sm"
                    >
                      View File
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={selectedImage}
                  alt="Full screen"
                  className="max-w-full max-h-[90vh] object-contain"
                />
                <button
                  onClick={closeFullscreen}
                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="pt- px-5 gap-3 bg-transparent flex items-center">
        <Icon
          icon="oui:arrow-left"
          className="bg-blue-900 text-white text-xl cursor-pointer"
          onClick={handleOnClose}
        />

        <h1 className="text-lg text-blue-900 font-semibold bg-transparent font-santoshi">
          Company Information
        </h1>
        <button className="px-8 py-1 bg-green-600 text-white rounded-lg">
          Verified
        </button>
      </div>
      <div className="pt-3 ml-7 bg-transparent">
        <hr className="border-black" />
      </div>

      <div className="mt-5 flex flex-col mx-10 m-auto rounded-xl">
        {accordionData.map((item, index) => (
          <div
            key={index}
            className={`mt-3 rounded-xl border border-neutral-200 bg-white dark:bg-body-dark ${
              index === 0 ? "rounded-xl" : index === accordionData.length - 1
            }`}
          >
            <h2
              className="mb-0 font-bold font-santoshi rounded-xl"
              id={`heading${index + 1}`}
            >
              <button
                className={`group relative flex w-full rounded-xl items-center border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition ${
                  activeIndex === index
                    ? "bg-white text-primary shadow-border-b dark:bg-surface-dark dark:text-primary dark:shadow-white/10"
                    : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(index)}
              >
                {item.title}
                <span
                  className={`-me-1 ms-auto h-5 w-5 transition-transform duration-200 ease-in-out ${
                    activeIndex === index ? "" : "rotate-180"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>
            </h2>
            <div
              id={`collapse${index + 1}`}
              className={`!visible ${
                activeIndex === index ? "" : "hidden"
              } transition duration-300`}
              aria-labelledby={`heading${index + 1}`}
            >
              <div className="px-5 py-4 w-[600px] rounded-lg h-auto m-auto mb-5 bg-white border">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end my-5 mx-14">
        <button
          className="border border-gray-600 bg-white hover:bg-blue-100 px-5 font-santoshi h-10 rounded-md text-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="border bg-red-600 hover:bg-red-400 px-5 mx-4 font-santoshi h-10 rounded-md text-white"
          onClick={handleOnClick}
        >
          Reject
        </button>
      </div>

      {showRejectModal && <RejectedModal data={data} onClose={handleClose} />}
      <ToastContainer />
    </>
  );
}

export default RowDetails;

const RejectedModal = ({ data, onClose }) => {
  const navigate = useNavigate();
  const companyId = data?._id;

  const [text, setText] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;

  const handleRejectedConfirm = async (e) => {
    e.preventDefault();
    if (!text) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      const response = await axios.put(
        `${apiURL}/admin/rejected-company/${companyId}`,
        { text: text }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          onClose();
          navigate("/admin/company");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating company:", error.message);
      toast.error("Failed to reject the company.");
    }
  };

  const handleClose = (event) => {
    if (event.target.id === "container") {
      onClose();
    }
  };

  return (
    <div
      id="container"
      className="w-full h-screen bg-black/30 fixed top-0 left-0 flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <div className="bg-white w-[30%] rounded-md overflow-hidden">
        <div className="bg-red-600 px-3 py-4 text-white">
          <h1>Reason for Rejection</h1>
        </div>
        <div className="p-6 flex flex-col gap-2">
          <textarea
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Type your reason..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="border bg-red-600 hover:bg-red-400 px-5 mx-4 font-santoshi h-10 rounded-md text-white"
            onClick={handleRejectedConfirm}
          >
            Reject
          </button>
          <button
            className="border border-gray-600 bg-white hover:bg-blue-100 px-5 font-santoshi h-10 rounded-md text-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
