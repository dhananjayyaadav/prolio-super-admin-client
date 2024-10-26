  import React, { useState, useEffect, useRef } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import Swal from "sweetalert2";
  import "react-toastify/dist/ReactToastify.css";
  import Loader from "../Re-use/Loader";

  const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [formMode, setFormMode] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      code: "",
      status: "active",
      _id: null,
    });
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const nameRef = useRef();
    const codeRef = useRef();
    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
      fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL}/department/get-departments`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch departments");
        }

        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(`Failed to fetch departments: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);

      try {
        const url =
          formMode === "add"
            ? `${apiURL}/department/create-department`
            : `${apiURL}/department/update-department/${formData._id}`;

        const response = await fetch(url, {
          method: formMode === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            code: formData.code,
            status: formData.status,
          }),
        });

        const data = await response.json();

        // Check if the response was not successful
        if (!response.ok) {
          throw new Error(data.message || "Failed to save department");
        }

        // Success case
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Department ${
            formMode === "add" ? "added" : "updated"
          } successfully`,
          timer: 2000,
          showConfirmButton: false,
        });

        resetForm();
        await fetchDepartments();
      } catch (error) {
        console.error("Error:", error);

        // More specific error handling
        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text: error.message || "Failed to save department. Please try again.",
        });

        // Field-specific error handling
        if (error.message?.toLowerCase().includes("name")) {
          nameRef.current?.focus();
        } else if (error.message?.toLowerCase().includes("code")) {
          codeRef.current?.focus();
        }
      } finally {
        setFormLoading(false);
      }
    };

    const resetForm = () => {
      setFormMode(null);
      setFormData({ name: "", code: "", status: "active", _id: null });
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your organization's departments and their details
              </p>
            </div>
            {!formMode && (
              <button
                onClick={() => setFormMode("add")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <span className="mr-2">+</span> Add Department
              </button>
            )}
          </div>

          {/* Form */}
          {formMode && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {formMode === "add" ? "Add New Department" : "Edit Department"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading && <Loader />}
                    {formMode === "add" ? "Add Department" : "Update Department"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Department List
              </h2>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader />
                  <span className="ml-2 text-gray-600">
                    Loading departments...
                  </span>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((department) => (
                      <tr key={department._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {department.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {department.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              department.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {department.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => startEdit(department)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(department._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && departments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No departments found. Click "Add Department" to create one.
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  };

  export default Department;
