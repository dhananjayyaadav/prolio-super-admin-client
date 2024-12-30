import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5007/admin/category/fetch-category"
      );
      setCategories(response.data.categories);
    } catch (error) {
      toast.error("Error fetching categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle category expansion
  const toggleExpand = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  // Render question and its subsections recursively
  const renderQuestion = (question, depth = 0) => {
    return (
      <div
        key={question.id}
        className={`p-3 bg-gray-50 rounded-md ${
          depth > 0 ? "ml-6 mt-2 border-l-2 border-blue-200" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {question.type === "subsection" && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                  Subsection
                </span>
              )}
              <p className="font-medium text-gray-700">{question.label}</p>
            </div>
            <p className="text-sm text-gray-500">
              Type: {question.type}
              {question.required && " (Required)"}
            </p>
          </div>
        </div>

        {/* Options for radio, select, checkbox */}
        {["radio", "select", "checkbox"].includes(question.type) && (
          <div className="mt-2 ml-4">
            <p className="text-sm text-gray-600 mb-1">Options:</p>
            <ul className="list-disc list-inside text-sm text-gray-500">
              {question.options?.map((option) => (
                <li key={option.id}>{option.label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Render subsection questions */}
        {question.type === "subsection" && question.subQuestions && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Subsection Questions:
            </p>
            <div className="space-y-2">
              {question.subQuestions.map((subQuestion) =>
                renderQuestion(subQuestion, depth + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your form categories
          </p>
        </div>
        <Link
          to="/add-category"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Category
        </Link>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 mb-4">No categories found</p>
          <Link
            to="/create-category"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="border rounded-lg bg-white shadow-sm"
            >
              {/* Category Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {category.categoryName}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {category.steps.length} steps
                    </span>
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-sm">
                      {category.steps.reduce(
                        (count, step) =>
                          count +
                          step.questions.filter((q) => q.type === "subsection")
                            .length,
                        0
                      )}{" "}
                      subsections
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(category._id)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    {expandedCategory === category._id ? "Collapse" : "Expand"}
                  </button>
                  <Link
                    to={`/edit-category/${category._id}`}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Edit
                  </Link>
                </div>
              </div>

              {/* Expanded View */}
              {expandedCategory === category._id && (
                <div className="border-t p-4">
                  {category.steps.map((step, stepIndex) => (
                    <div key={step.id} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {stepIndex + 1}
                        </span>
                        <h3 className="font-medium text-gray-900">
                          {step.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({step.questions.length} questions)
                        </span>
                      </div>
                      <div className="ml-8 space-y-3">
                        {step.questions.map((question) =>
                          renderQuestion(question)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Category;
