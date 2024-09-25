import React, { useState } from "react";
import { X } from "lucide-react";

const AddForum = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    forumName: "",
    forumDescription: "",
    objective: "",
    companyName: "",
    companyEmail: "",
    companyContactNumber: "",
    companyAlternativeNumber: "",
    aboutCompany: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Forum</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mr-6 flex-shrink-0">
                <img
                  src="/api/placeholder/96/96"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Forum Name
                  </label>
                  <input
                    type="text"
                    name="forumName"
                    value={formData.forumName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter your forum name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Forum Description
                  </label>
                  <input
                    type="text"
                    name="forumDescription"
                    value={formData.forumDescription}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter forum description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Objective
                  </label>
                  <input
                    type="text"
                    name="objective"
                    value={formData.objective}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter objective"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Email Address
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter company email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Contact Number
                  </label>
                  <input
                    type="tel"
                    name="companyContactNumber"
                    value={formData.companyContactNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Alternative Number
                  </label>
                  <input
                    type="tel"
                    name="companyAlternativeNumber"
                    value={formData.companyAlternativeNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter alternative number"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  About Company
                </label>
                <textarea
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter about company"
                ></textarea>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Add Members / Invite members to Forum
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...Array(11)].map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"
                  >
                    <img
                      src={`/api/placeholder/40/40?text=${index + 1}`}
                      alt={`Member ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  850+
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Invite People
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Forum
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddForum;
