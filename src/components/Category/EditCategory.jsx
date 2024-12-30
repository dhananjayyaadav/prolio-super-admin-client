import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formStructure, setFormStructure] = useState({
    categoryName: "",
    steps: [],
    subCategories: [], // Add this
    isActive: true, // Add this
  });

  // Available question types
  const questionTypes = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "number", label: "Number" },
    { value: "select", label: "Dropdown Select" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "date", label: "Date" },
    { value: "subsection", label: "Subsection" }, // Added subsection type
  ];

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5007/admin/category/fetch-category`
        );
        const category = response.data.categories.find((cat) => cat._id === id);

        if (category) {
          setFormStructure({
            categoryName: category.categoryName,
            steps: category.steps,
            subCategories: category.subCategories, // Add this
            isActive: category.isActive, // Add this
          });
        } else {
          toast.error("Category not found");
          navigate("/categories");
        }
      } catch (error) {
        toast.error("Error fetching category");
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        addStep();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [formStructure]);

  const updateCategoryName = (name) => {
    setFormStructure((prev) => ({
      ...prev,
      categoryName: name,
    }));
  };

  // Add functions to manage subCategories
  const addSubCategory = () => {
    setFormStructure((prev) => ({
      ...prev,
      subCategories: [
        ...prev.subCategories,
        { id: Date.now(), name: "", isActive: true },
      ],
    }));
  };

  const removeSubCategory = (subCategoryId) => {
    setFormStructure((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((sc) => sc.id !== subCategoryId),
    }));
  };

  // Update the updateSubCategory function
  const updateSubCategory = (subCategoryId, field, value) => {
    setFormStructure((prev) => ({
      ...prev,
      subCategories: prev.subCategories.map((sc) =>
        sc.id === subCategoryId ? { ...sc, [field]: value } : sc
      ),
    }));
  };

  // Add a new step
  const addStep = () => {
    setFormStructure((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now(),
          title: "",
          questions: [],
        },
      ],
    }));
  };
  // ... [Previous keyboard shortcuts and updateCategoryName functions remain the same] ...

  // Update question
  const updateQuestion = (
    stepId,
    questionId,
    field,
    value,
    parentQuestionId = null
  ) => {
    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.map((subQuestion) => {
                      if (subQuestion.id === questionId) {
                        if (
                          field === "type" &&
                          (value === "radio" ||
                            value === "select" ||
                            value === "checkbox")
                        ) {
                          return {
                            ...subQuestion,
                            [field]: value,
                            options: subQuestion.options || [],
                          };
                        }
                        return { ...subQuestion, [field]: value };
                      }
                      return subQuestion;
                    }),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === questionId) {
                  if (
                    field === "type" &&
                    (value === "radio" ||
                      value === "select" ||
                      value === "checkbox")
                  ) {
                    return {
                      ...question,
                      [field]: value,
                      options: question.options || [],
                    };
                  }
                  if (field === "type" && value === "subsection") {
                    return {
                      ...question,
                      [field]: value,
                      subQuestions: question.subQuestions || [],
                    };
                  }
                  return { ...question, [field]: value };
                }
                return question;
              }),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Add a question
  const addQuestion = (stepId, parentQuestionId = null) => {
    const newQuestion = {
      id: Date.now(),
      type: "text",
      label: "",
      required: false,
      options: [],
    };

    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: [
                      ...(question.subQuestions || []),
                      newQuestion,
                    ],
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: [...step.questions, newQuestion],
            };
          }
        }
        return step;
      }),
    }));
  };

  // Remove a question
  const removeQuestion = (stepId, questionId, parentQuestionId = null) => {
    if (!window.confirm("Are you sure you want to remove this question?"))
      return;

    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.filter(
                      (q) => q.id !== questionId
                    ),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.filter((q) => q.id !== questionId),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Add option
  const addOption = (stepId, questionId, parentQuestionId = null) => {
    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.map((subQuestion) => {
                      if (subQuestion.id === questionId) {
                        return {
                          ...subQuestion,
                          options: [
                            ...(subQuestion.options || []),
                            { id: Date.now(), label: "" },
                          ],
                        };
                      }
                      return subQuestion;
                    }),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === questionId) {
                  return {
                    ...question,
                    options: [
                      ...(question.options || []),
                      { id: Date.now(), label: "" },
                    ],
                  };
                }
                return question;
              }),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Remove option
  const removeOption = (
    stepId,
    questionId,
    optionId,
    parentQuestionId = null
  ) => {
    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.map((subQuestion) => {
                      if (subQuestion.id === questionId) {
                        return {
                          ...subQuestion,
                          options: subQuestion.options.filter(
                            (opt) => opt.id !== optionId
                          ),
                        };
                      }
                      return subQuestion;
                    }),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === questionId) {
                  return {
                    ...question,
                    options: question.options.filter(
                      (opt) => opt.id !== optionId
                    ),
                  };
                }
                return question;
              }),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Update option
  const updateOption = (
    stepId,
    questionId,
    optionId,
    value,
    parentQuestionId = null
  ) => {
    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.map((subQuestion) => {
                      if (subQuestion.id === questionId) {
                        return {
                          ...subQuestion,
                          options: subQuestion.options.map((option) =>
                            option.id === optionId
                              ? { ...option, label: value }
                              : option
                          ),
                        };
                      }
                      return subQuestion;
                    }),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === questionId) {
                  return {
                    ...question,
                    options: question.options.map((option) =>
                      option.id === optionId
                        ? { ...option, label: value }
                        : option
                    ),
                  };
                }
                return question;
              }),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Handle drag and drop for questions
  const handleQuestionDragEnd = (result, stepId, parentQuestionId = null) => {
    if (!result.destination) return;

    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  const subQuestions = Array.from(question.subQuestions || []);
                  const [reorderedItem] = subQuestions.splice(
                    result.source.index,
                    1
                  );
                  subQuestions.splice(
                    result.destination.index,
                    0,
                    reorderedItem
                  );
                  return { ...question, subQuestions };
                }
                return question;
              }),
            };
          } else {
            const questions = Array.from(step.questions);
            const [reorderedItem] = questions.splice(result.source.index, 1);
            questions.splice(result.destination.index, 0, reorderedItem);
            return { ...step, questions };
          }
        }
        return step;
      }),
    }));
  };

  // Handle drag and drop for options
  const handleOptionDragEnd = (
    result,
    stepId,
    questionId,
    parentQuestionId = null
  ) => {
    if (!result.destination) return;

    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          if (parentQuestionId) {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === parentQuestionId) {
                  return {
                    ...question,
                    subQuestions: question.subQuestions.map((subQuestion) => {
                      if (subQuestion.id === questionId) {
                        const options = Array.from(subQuestion.options || []);
                        const [reorderedItem] = options.splice(
                          result.source.index,
                          1
                        );
                        options.splice(
                          result.destination.index,
                          0,
                          reorderedItem
                        );
                        return { ...subQuestion, options };
                      }
                      return subQuestion;
                    }),
                  };
                }
                return question;
              }),
            };
          } else {
            return {
              ...step,
              questions: step.questions.map((question) => {
                if (question.id === questionId) {
                  const options = Array.from(question.options || []);
                  const [reorderedItem] = options.splice(
                    result.source.index,
                    1
                  );
                  options.splice(result.destination.index, 0, reorderedItem);
                  return { ...question, options };
                }
                return question;
              }),
            };
          }
        }
        return step;
      }),
    }));
  };

  // Validate form with subsections
  const validateForm = () => {
    const errors = [];

    if (!formStructure.categoryName.trim()) {
      errors.push("Category name is required");
    }

    if (formStructure.steps.length === 0) {
      errors.push("At least one step is required");
    }

    const validateQuestions = (questions, stepIndex, parentLabel = "") => {
      questions.forEach((question, questionIndex) => {
        const questionPath = parentLabel
          ? `${parentLabel} > Question ${questionIndex + 1}`
          : `Step ${stepIndex + 1}, Question ${questionIndex + 1}`;

        if (!question.label.trim()) {
          errors.push(`${questionPath} requires a label`);
        }

        if (
          ["radio", "select", "checkbox"].includes(question.type) &&
          (!question.options || question.options.length === 0)
        ) {
          errors.push(`${questionPath} requires options`);
        }

        if (
          question.type === "subsection" &&
          (!question.subQuestions || question.subQuestions.length === 0)
        ) {
          errors.push(
            `${questionPath} (Subsection) requires at least one question`
          );
        }

        if (question.subQuestions) {
          validateQuestions(question.subQuestions, stepIndex, question.label);
        }
      });
    };

    formStructure.steps.forEach((step, stepIndex) => {
      if (!step.title.trim()) {
        errors.push(`Step ${stepIndex + 1} requires a title`);
      }

      if (step.questions.length === 0) {
        errors.push(`Step ${stepIndex + 1} requires at least one question`);
      }

      validateQuestions(step.questions, stepIndex);
    });

    formStructure.subCategories.forEach((subCategory, index) => {
      if (!subCategory.name.trim()) {
        errors.push(`Sub-category ${index + 1} requires a name`);
      }
    });

    return errors;
  };

  // Save form
  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5007/admin/category/edit-category/${id}`,
        formStructure
      );
      toast.success(response.data.message);
      navigate("/category");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop for steps
  const handleStepDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formStructure.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormStructure((prev) => ({
      ...prev,
      steps: items,
    }));
  };

  // Add this function with your other state update functions
  const updateStepTitle = (stepId, title) => {
    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            title: title,
          };
        }
        return step;
      }),
    }));
  };

  // And add the removeStep function that's also referenced but missing
  const removeStep = (stepId) => {
    if (!window.confirm("Are you sure you want to remove this step?")) return;

    setFormStructure((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
    }));
  };

  // Render options section for a question
  const renderOptionsSection = (question, stepId, parentQuestionId = null) => {
    if (!["radio", "select", "checkbox"].includes(question.type)) return null;

    return (
      <div>
        <div className="mt-4"></div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <DragDropContext
          onDragEnd={(result) =>
            handleOptionDragEnd(result, stepId, question.id, parentQuestionId)
          }
        >
          <Droppable droppableId={`options-${question.id}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {question.options?.map((option, optionIndex) => (
                  <Draggable
                    key={option.id}
                    draggableId={option.id.toString()}
                    index={optionIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center gap-2"
                      >
                        <span className="text-gray-400">⋮⋮</span>
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) =>
                            updateOption(
                              stepId,
                              question.id,
                              option.id,
                              e.target.value,
                              parentQuestionId
                            )
                          }
                          placeholder="Enter option"
                          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() =>
                            removeOption(
                              stepId,
                              question.id,
                              option.id,
                              parentQuestionId
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => addOption(stepId, question.id, parentQuestionId)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          + Add Option
        </button>
      </div>
    );
  };

  // Render question fields
  const renderQuestionFields = (question, stepId, parentQuestionId = null) => {
    return (
      <>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Label *
            </label>
            <input
              type="text"
              value={question.label}
              onChange={(e) =>
                updateQuestion(
                  stepId,
                  question.id,
                  "label",
                  e.target.value,
                  parentQuestionId
                )
              }
              placeholder="Enter question label"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type
            </label>
            <select
              value={question.type}
              onChange={(e) =>
                updateQuestion(
                  stepId,
                  question.id,
                  "type",
                  e.target.value,
                  parentQuestionId
                )
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                updateQuestion(
                  stepId,
                  question.id,
                  "required",
                  e.target.checked,
                  parentQuestionId
                )
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Required field</span>
          </label>
          <button
            onClick={() =>
              removeQuestion(stepId, question.id, parentQuestionId)
            }
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove Question
          </button>
        </div>

        {/* Options section for select, radio, checkbox */}
        {renderOptionsSection(question, stepId, parentQuestionId)}

        {/* Subsection questions */}
        {question.type === "subsection" && (
          <div className="mt-4 pl-6 border-l-2 border-blue-200">
            <div className="mb-2 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">
                Subsection Questions
              </h4>
              <button
                onClick={() => addQuestion(stepId, question.id)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Subsection Question
              </button>
            </div>
            <DragDropContext
              onDragEnd={(result) =>
                handleQuestionDragEnd(result, stepId, question.id)
              }
            >
              <Droppable droppableId={`subquestions-${question.id}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {(question.subQuestions || []).map(
                      (subQuestion, subIndex) => (
                        <Draggable
                          key={subQuestion.id}
                          draggableId={subQuestion.id.toString()}
                          index={subIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border rounded-lg p-4 bg-gray-50"
                            >
                              {renderQuestionFields(
                                subQuestion,
                                stepId,
                                question.id
                              )}
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Link to="/category">
              <ArrowLeft className="cursor-pointer" />
            </Link>
            Edit Category
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify Category Form Structure
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/category")}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={addStep}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Add Step
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Category Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          value={formStructure.categoryName}
          onChange={(e) => updateCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formStructure.isActive}
            onChange={(e) =>
              setFormStructure((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Category Active
          </span>
        </label>
      </div>

      {/* Sub-Categories Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Sub-Categories</h2>
          <button
            onClick={addSubCategory}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Add Sub-Category
          </button>
        </div>

        <div className="space-y-3">
          {formStructure.subCategories.map((subCategory, index) => (
            <div
              key={subCategory.id}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <input
                type="text"
                value={subCategory.name}
                onChange={(e) =>
                  updateSubCategory(subCategory.id, "name", e.target.value)
                }
                placeholder="Sub-category name"
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={subCategory.isActive}
                  onChange={(e) =>
                    updateSubCategory(
                      subCategory.id,
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Active</span>
              </label>
              <button
                onClick={() => removeSubCategory(subCategory.id)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <DragDropContext onDragEnd={handleStepDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {formStructure.steps.map((step, stepIndex) => (
                <Draggable
                  key={step.id}
                  draggableId={step.id.toString()}
                  index={stepIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border rounded-lg bg-white shadow-sm"
                    >
                      {/* Step Header */}
                      <div
                        {...provided.dragHandleProps}
                        className="p-4 bg-gray-50 border-b flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-medium">
                            {stepIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) =>
                              updateStepTitle(step.id, e.target.value)
                            }
                            placeholder="Enter step title"
                            className="px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Questions */}
                      <div className="p-4">
                        <DragDropContext
                          onDragEnd={(result) =>
                            handleQuestionDragEnd(result, step.id)
                          }
                        >
                          <Droppable droppableId={`questions-${step.id}`}>
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                              >
                                {step.questions.map(
                                  (question, questionIndex) => (
                                    <Draggable
                                      key={question.id}
                                      draggableId={question.id.toString()}
                                      index={questionIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="border rounded-lg p-4"
                                        >
                                          {renderQuestionFields(
                                            question,
                                            step.id
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>

                        {/* Add Question Button */}
                        <button
                          onClick={() => addQuestion(step.id)}
                          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
                        >
                          + Add Question
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {formStructure.steps.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 mb-4">No steps added yet</p>
          <button
            onClick={addStep}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add First Step
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EditCategory;
