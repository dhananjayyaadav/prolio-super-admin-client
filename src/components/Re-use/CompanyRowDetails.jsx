import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import deleteIcon from "../../assets/delete.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function CompanyRowDetails({ data, onClose }) {
  const handleOnClose = () => {
    onClose();
  };

  // const apiURL = process.env.REACT_APP_API_URL;

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOnClick = () => {
    setShowRejectModal(true);
  };

  const handleOnClickVerify = () => {
    if (isAllChecked()) {
      setShowVerifyModal(true);
    } else {
      toast.success("Please verify all steps.");
    }
  };


  const handleClose = () => {
    setShowRejectModal(false);
  };

  const handleCloseVerify = () => {
    setShowVerifyModal(false);
  };

  const openFullscreen = (url) => {
    setSelectedImage(url);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const isAllChecked = () => {
    return isChecked.every((checked) => checked);
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
            <p className="font-santoshi m-0">Total Employee</p>
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
  const [isChecked, setIsChecked] = useState(
    Array(accordionData.length).fill(false)
  );

  const handleVerifyAndContinue = (index) => {
    const updatedIsChecked = [...isChecked];
    updatedIsChecked[index] = true;
    setIsChecked(updatedIsChecked);
    setActiveIndex(-1); // Close accordion
  };

  return (
    <>
      <div className="pt- px-5 gap-3 bg-transparent flex items-center">
        <Icon
          icon="oui:arrow-left"
          className="bg-blue-900 text-white text-xl cursor-pointer"
          onClick={handleOnClose}
        />

        <h1 className="text-lg text-blue-900 font-semibold bg-transparent font-santoshi">
          Pending verifications &gt; Company Information
        </h1>
      </div>
      <div className="pt-3 ml-7  bg-transparent">
        <hr className="border-black" />
      </div>

      <div className="mt-10 flex  flex-col   md:w-[900px] m-auto rounded-xl ">
        {accordionData.map((item, index) => (
          <div
            key={index}
            className={`mt-3 rounded-xl  border border-neutral-200 bg-white dark:bg-body-dark ${
              index === 0 ? "rounded-xl" : index === accordionData.length - 1
            }`}
          >
            <h2
              className="mb-0 font-bold font-santoshi rounded-xl"
              id={`heading${index + 1}`}
            >
              <button
                className={`group relative flex w-full rounded-xl items-center rounded-t-lg border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition overflow-anchor-none hover:z-[2] focus:z-[3] focus:outline-none dark:bg-body-dark dark:text-black ${
                  activeIndex === index
                    ? "bg-white text-primary shadow-border-b dark:bg-surface-dark dark:text-primary dark:shadow-white/10"
                    : ""
                }`}
                type="button"
                data-twe-collapse-init
                data-twe-target={`#collapse${index + 1}`}
                aria-expanded={activeIndex === index ? "true" : "false"}
                aria-controls={`collapse${index + 1}`}
                onClick={() => toggleAccordion(index)}
              >
                <input
                  type="checkbox"
                  checked={isChecked[index]}
                  className="rounded-full h-5 w-5 mr-2 border border-blue-500 focus:ring-primary dark:bg-body-dark dark:border-neutral-600"
                  disabled={!isChecked[index] && activeIndex !== index}
                />
                {item.title}
                <span
                  className={`-me-1 ms-auto h-5 w-5 shrink-0 transition-transform duration-200 ease-in-out group-data-twe-collapse-collapsed:me-0 group-data-twe-collapse-collapsed:rotate-0 motion-reduce:transition-none ${
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
                      d="M19.5 15.75l-7.5-7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </button>
            </h2>
            <div
              id={`collapse${index + 1}`}
              className={`!visible  ${activeIndex === index ? "" : "hidden"}`}
              data-twe-collapse-item
              aria-labelledby={`heading${index + 1}`}
            >
              <div className="px-5 py-4 w-[600px] rounded-lg h-auto m-auto mb-5 bg-white border ">
                {item.content}
              </div>

              <div className="flex justify-end mb-5">
                <button
                  className="border bg-blue-900 px-5 mx-4 font-santoshi h-10 rounded-xl  text-white"
                  onClick={() => handleVerifyAndContinue(index)}
                >
                  Verify and continue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end  my-5 mx-14">
        <button
          className="border border-red-600 bg-white px-5  font-santoshi h-10 rounded-md  text-red-600"
          onClick={handleOnClick}
        >
          Reject
        </button>
        <button
          className="border bg-green-700 px-5 mx-4 font-santoshi h-10 rounded-md  text-white"
          onClick={handleOnClickVerify}
        >
          Verify
        </button>
      </div>

      {showRejectModal && <RejectedModal data={data} onClose={handleClose} />}
      {showVerifyModal && (
        <VerifyModal data={data} onClose={handleCloseVerify} />
      )}
      <ToastContainer />
    </>
  );
}

export default CompanyRowDetails;

const RejectedModal = ({ data, onClose }) => {
  const navigate = useNavigate();
  const companyId = data?._id;
  const [text, setText] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;

  const handleRejectedConfirm = async (e) => {
    e.preventDefault();
    if (!text) return;
    try {
      const response = await axios.put(
        `${apiURL}/admin/rejected-company/${companyId}`,
        { text: text }
      );
      if (response.status === 200) {
        toast.success(response.data?.message);
        setTimeout(() => {
          onClose(); 
          navigate("/admin/company"); 
        }, 1000);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error("Error updating company:", error.message);
    }
  };

  const handleClose = (event) => {
    if (event.target.id === "container") {
      onClose();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div
      id="container"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleClose}
    >
      <div className="bg-blue-100 w-[700px] p-8 rounded-md">
        <div className="flex gap-5">
          <img src={deleteIcon} className="h-10" alt="delete icon" />
          <h2 className="text-2xl font-bold py-2 font-santoshi">
            {data?.companyName || "Company Name"}
          </h2>
        </div>
        <div className="">
          <p className="font-santoshi">
            Are you sure you want to reject this company? If so, please provide
            a reason:
          </p>
          <textarea
            className="w-full mt-3 rounded-xl font-santoshi text-gray-400 p-4 focus:outline-none"
            name="text"
            value={text}
            placeholder="For what reason is this company being rejected?"
            cols="30"
            rows="10"
            onChange={handleTextChange}
          ></textarea>
        </div>
        <div className="flex justify-end gap-5 mt-2">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-blue-50 border border-gray-500 text-gray-800 px-7 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            className={`bg-blue-900 hover:bg-blue-600 text-white px-7 py-2 rounded-md ${
              !text ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleRejectedConfirm}
            disabled={!text}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyModal = ({ data, onClose }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate(); // Ensure you are using the hook correctly

  const handleClose = (event) => {
    if (event.target.id === "container") {
      onClose();
    }
  };

  const companyId = data?._id;

  const handleConfirm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${apiURL}/admin/verified-company/${companyId}`
      );
      if (response.status === 200) {
        toast.success(response.data?.message);
        setTimeout(() => {
          onClose();
          navigate("/admin/company");
        }, 2000);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error("Error updating company:", error.message);
    }
  };

  return (
    <div
      id="container"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleClose}
    >
      <div className="bg-blue-100 w-[700px] p-8  gap-6 rounded-md flex flex-col items-center justify-center ">
        <Icon
          icon="teenyicons:tick-solid"
          className="border border-blue-900 p-3 text-blue-900 rounded-full text-xl font-bold"
        />

        <p className="text-center font-santoshi text-gray-600  mt-2">
          <span className="font-bold">{data?.companyName} </span>Verification
          process has been <br /> successfully Completed
        </p>

        <div className="flex gap-5 mt-2">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-blue-50 border border-gray-500 text-gray-800 px-7 py-2 rounded-md"
          >
            Cancel{" "}
          </button>
          <button
            className="bg-blue-900 hover:bg-blue-600 text-white px-7 py-2 rounded-md"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
