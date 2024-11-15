import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateTypes.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Delete from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Re-use/Loader";
import { useNavigate } from "react-router-dom";
const EditType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const apiURL = process.env.REACT_APP_API_URL;
  const [Loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [steps, setSteps] = useState([]);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`${apiURL}/type/types/${id}`)
      .then((res) => {
        setLoading(false);
        setType(res.data.typeName);
        setSteps(res.data.steps);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddStep = () => {
    const newStep = {
      id: steps.length + 1,
      name: "",
      questions: [
        {
          id: 1,
          description: "",
          subDescription: "",
          type: "text", // Default type
          options: [], // Default empty options array
          value: "",
          arrayValue: [],
          status: false,
          attributes: [], // Initialize attributes array for attribute type
          cards: [],
          required: true,
          images: [],
        },
      ], // Array to hold questions for this step
      condition: true,
    };
    setSteps([...steps, newStep]);
  };

  const handleStepNameChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].name = value;
    setSteps(newSteps);
  };

  const handleAddQuestion = (stepIndex) => {
    const newQuestion = {
      id: steps[stepIndex].questions.length + 1,
      description: "",
      subDescription: "",
      type: "text", // Default type
      options: [], // Default empty options array
      value: "",
      arrayValue: [],
      status: false,
      attributes: [],
      cards: [], // Initialize attributes array for attribute type
      required: true,
      images: [],
    };
    const newSteps = [...steps];
    newSteps[stepIndex].questions.push(newQuestion);
    setSteps(newSteps);
  };

  const handleQuestionChange = (stepIndex, questionIndex, key, value) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex][key] = value;
    setSteps(newSteps);
  };

  const handleDeleteStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleDeleteQuestion = (stepIndex, questionIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions.splice(questionIndex, 1);
    setSteps(newSteps);
  };

  const handleAddOption = (stepIndex, questionIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].options.push("");
    setSteps(newSteps);
  };

  const handleAddOptionCard = (stepIndex, questionIndex, cardIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards[cardIndex].options.push(
      ""
    );
    setSteps(newSteps);
  };

  const handleDeleteOption = (stepIndex, questionIndex, optionIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].options.splice(optionIndex, 1);
    setSteps(newSteps);
  };

  const handleDeleteOptionCard = (
    stepIndex,
    questionIndex,
    cardIndex,
    optionIndex
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards[
      cardIndex
    ].options.splice(optionIndex, 1);
    setSteps(newSteps);
  };

  const handleExpandStep = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].condition = !newSteps[stepIndex].condition;
    setSteps(newSteps);
  };

  const handleAddAttribute = (stepIndex, questionIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].attributes.push({
      name: "",
      value: "",
    });
    setSteps(newSteps);
  };

  const handleCardAddAttribute = (
    stepIndex,
    questionIndex,
    cardIndex,
    image
  ) => {
    if (image === "image") {
      const newSteps = [...steps];
      newSteps[stepIndex].questions[questionIndex].cards[
        cardIndex
      ].attributes.push({
        name: "",
        value: "",
        image: [],
      });
      setSteps(newSteps);
    } else {
      const newSteps = [...steps];
      newSteps[stepIndex].questions[questionIndex].cards[
        cardIndex
      ].attributes.push({
        name: "",
        value: "",
      });
      setSteps(newSteps);
    }
  };

  const handleDeleteAttribute = (stepIndex, questionIndex, attributeIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].attributes.splice(
      attributeIndex,
      1
    );
    setSteps(newSteps);
  };

  const handleCardDeleteAttribute = (
    stepIndex,
    questionIndex,
    cardIndex,
    attributeIndex
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards[
      cardIndex
    ].attributes.splice(attributeIndex, 1);
    setSteps(newSteps);
  };

  const handleAttributeChange = (
    stepIndex,
    questionIndex,
    attributeIndex,
    key,
    value
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].attributes[attributeIndex][
      key
    ] = value;
    setSteps(newSteps);
  };

  const handleCardAttributeChange = (
    stepIndex,
    questionIndex,
    cardIndex,
    attributeIndex,
    key,
    value
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards[cardIndex].attributes[
      attributeIndex
    ][key] = value;
    setSteps(newSteps);
  };

  const handleAddCardQuestion = (stepIndex, questionIndex) => {
    const newQuestion = {
      id: steps[stepIndex].questions[questionIndex].cards.length + 1,
      description: "",
      subDescription: "",
      type: "text", // Default type
      options: [], // Default empty options array
      value: "",
      arrayValue: [],
      status: false,
      required: true,
      attributes: [],
      images: [],
    };
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards.push(newQuestion);
    setSteps(newSteps);
  };

  const handleCardQuestionChange = (
    stepIndex,
    questionIndex,
    cardIndex,
    key,
    value
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards[cardIndex][key] = value;
    setSteps(newSteps);
  };

  const handleDeleteCardQuestion = (stepIndex, questionIndex, cardIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].questions[questionIndex].cards.splice(cardIndex, 1);
    setSteps(newSteps);
  };

  const createType = async () => {
    if (type === "") {
      toast.warning("Please enter a type name");
      return;
    }
    // Check if any step's name is empty
    const emptyStepIndex = steps.findIndex((step) => step.name.trim() === "");

    // Check if any question description is empty
    const hasEmptyQuestion = steps.some((step) => {
      return step.questions.some(
        (question) => question.description.trim() === ""
      );
    });

    // Check if any question of type dropdown, radio, or select has no options
    const hasQuestionWithoutOptions = steps.some((step) => {
      return step.questions.some((question) => {
        return (
          (question.type === "select" || question.type === "radio") &&
          question.options.length === 0
        );
      });
    });

    // Check if any option for questions of type dropdown, radio, or select is empty
    const hasEmptyOption = steps.some((step) => {
      return step.questions.some((question) => {
        return (
          (question.type === "select" || question.type === "radio") &&
          question.options.some((option) => option.trim() === "")
        );
      });
    });

    if (emptyStepIndex !== -1) {
      // Display a toast message if any step's name is empty
      toast.error("Please fill the step name for all the sections");
    } else if (hasEmptyQuestion) {
      // Display a toast message if any question's description is empty
      toast.error("Please fill question description for all the questions");
    } else if (hasQuestionWithoutOptions) {
      // Display a toast message if any question of type dropdown, radio, or select has no options
      toast.error(
        "Please add at least one option for Questions with type radio or dropdown"
      );
    } else if (hasEmptyOption) {
      // Display a toast message if any option for questions of type dropdown, radio, or select is empty
      toast.error(
        "Please fill all options for Questions with type radio or dropdown"
      );
    } else {
      // All step names, question descriptions, and options are valid, proceed with type creation
      setLoading(true);
      await axios
        .put(`${apiURL}/type/types/${id}`, {
          typeName: type,
          steps,
        })
        .then((res) => {
          setLoading(false);
          toast.info(res.data.message);
          getData();
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
          toast.error(err.response.data.error);
        });
      // You can do something with the type and steps here
    }
  };

  return (
    <div>
      {Loading ? (
        <Loader />
      ) : (
        <div>
          <button
            onClick={() => {
              navigate("/admin/type");
            }}
          >
            Back
          </button>
          <h1 className="create-type-heading">Edit Type</h1>
          <label className="type-label" htmlFor="">
            Enter Type
          </label>
          <input
            className="type-input"
            type="text"
            value={type}
            placeholder="Enter Type"
            onChange={(e) => setType(e.target.value)}
          />
          <br />
          <br />
          {steps.map((step, stepIndex) => (
            <div key={step.id} className="step">
              <label className="type-label" htmlFor="Question">
                Step Name
              </label>
              <input
                className="type-input"
                type="text"
                placeholder="Enter Step name"
                value={step.name}
                onChange={(e) =>
                  handleStepNameChange(stepIndex, e.target.value)
                }
              />

              {/* <Delete onClick={() => handleDeleteStep(stepIndex)} /> */}
              {step.condition ? (
                <ExpandLessIcon onClick={() => handleExpandStep(stepIndex)} />
              ) : (
                <ExpandMoreIcon onClick={() => handleExpandStep(stepIndex)} />
              )}
              {step.questions.length === 0 && (
                <h5 style={{ textAlign: "center" }}>
                  Please add questions under this step
                </h5>
              )}
              {step.condition &&
                step.questions.map((question, questionIndex) => (
                  <div key={question.id} className="single-questions">
                    <label className="type-label" htmlFor="Question">
                      Question Description
                    </label>
                    <input
                      className="type-input"
                      type="text"
                      placeholder="Enter Question description"
                      value={question.description}
                      onChange={(e) =>
                        handleQuestionChange(
                          stepIndex,
                          questionIndex,
                          "description",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="type-input"
                      type="text"
                      placeholder="Enter sub  description"
                      value={question.subDescription}
                      onChange={(e) =>
                        handleQuestionChange(
                          stepIndex,
                          questionIndex,
                          "subDescription",
                          e.target.value
                        )
                      }
                    />
                    <select
                      className="type-select"
                      value={question.type}
                      onChange={(e) =>
                        handleQuestionChange(
                          stepIndex,
                          questionIndex,
                          "type",
                          e.target.value
                        )
                      }
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="textarea">Description</option>
                      <option value="select">Dropdown</option>
                      <option value="file">Image</option>
                      <option value="radio">Radio</option>
                      <option value="attributes">Attribute</option>
                      <option value="card">Card</option>
                    </select>
                    {question.type === "select" && (
                      <button
                        className="type-button"
                        onClick={() =>
                          handleAddOption(stepIndex, questionIndex)
                        }
                      >
                        Add Option
                      </button>
                    )}
                    {question.type === "radio" && (
                      <button
                        className="type-button"
                        onClick={() =>
                          handleAddOption(stepIndex, questionIndex)
                        }
                      >
                        Add Option
                      </button>
                    )}
                    {question.type === "select" && (
                      <div className="drop-down-option-container">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              className="type-input"
                              type="text"
                              placeholder="Enter Option"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                handleQuestionChange(
                                  stepIndex,
                                  questionIndex,
                                  "options",
                                  newOptions
                                );
                              }}
                            />
                            <Delete
                              onClick={() =>
                                handleDeleteOption(
                                  stepIndex,
                                  questionIndex,
                                  optionIndex
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {question.type === "radio" && (
                      <div className="drop-down-option-container">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              className="type-input"
                              type="text"
                              placeholder="Enter Option"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                handleQuestionChange(
                                  stepIndex,
                                  questionIndex,
                                  "options",
                                  newOptions
                                );
                              }}
                            />
                            <Delete
                              onClick={() =>
                                handleDeleteOption(
                                  stepIndex,
                                  questionIndex,
                                  optionIndex
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "attributes" && (
                      <div>
                        <label className="type-label" htmlFor="attributes">
                          Attributes
                        </label>
                        <button
                          className="type-button"
                          onClick={() =>
                            handleAddAttribute(stepIndex, questionIndex)
                          }
                        >
                          Add Attribute
                        </button>
                        <div style={{ marginBottom: "20px" }}>
                          {question.attributes.map(
                            (attribute, attributeIndex) => (
                              <div key={attributeIndex}>
                                <input
                                  className="type-input"
                                  type="text"
                                  placeholder="Attribute Name"
                                  value={attribute.name}
                                  onChange={(e) =>
                                    handleAttributeChange(
                                      stepIndex,
                                      questionIndex,
                                      attributeIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  className="type-input"
                                  type="text"
                                  placeholder="Attribute Value"
                                  value={attribute.value}
                                  onChange={(e) =>
                                    handleAttributeChange(
                                      stepIndex,
                                      questionIndex,
                                      attributeIndex,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                                <Delete
                                  onClick={() =>
                                    handleDeleteAttribute(
                                      stepIndex,
                                      questionIndex,
                                      attributeIndex
                                    )
                                  }
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {question.type === "card" && (
                      <div>
                        <button
                          className="type-button"
                          onClick={() =>
                            handleAddCardQuestion(stepIndex, questionIndex)
                          }
                        >
                          Add Card Question
                        </button>
                        <div style={{ marginBottom: "20px" }}>
                          {question.cards.map((card, cardIndex) => (
                            <div key={cardIndex}>
                              <input
                                className="type-input"
                                type="text"
                                placeholder="Card Question Description"
                                value={card.description}
                                onChange={(e) =>
                                  handleCardQuestionChange(
                                    stepIndex,
                                    questionIndex,
                                    cardIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                className="type-input"
                                type="text"
                                placeholder="Card Subdescription"
                                value={card.subDescription}
                                onChange={(e) =>
                                  handleCardQuestionChange(
                                    stepIndex,
                                    questionIndex,
                                    cardIndex,
                                    "subDescription",
                                    e.target.value
                                  )
                                }
                              />
                              <select
                                className="type-select"
                                value={card.type}
                                onChange={(e) =>
                                  handleCardQuestionChange(
                                    stepIndex,
                                    questionIndex,
                                    cardIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="textarea">Description</option>
                                <option value="select">Dropdown</option>
                                <option value="radio">Radio</option>
                                <option value="file">Images</option>
                                <option value="attributes">Attribute</option>
                                <option value="imageAttribute">
                                  Image Attribute
                                </option>
                              </select>
                              <button
                                className="type-button"
                                onClick={() =>
                                  handleDeleteCardQuestion(
                                    stepIndex,
                                    questionIndex,
                                    cardIndex
                                  )
                                }
                              >
                                Delete
                              </button>
                              {card.type === "radio" && (
                                <button
                                  className="type-button"
                                  onClick={() => {
                                    handleAddOptionCard(
                                      stepIndex,
                                      questionIndex,
                                      cardIndex
                                    );
                                  }}
                                >
                                  Add Option
                                </button>
                              )}
                              {card.type === "select" && (
                                <button
                                  className="type-button"
                                  onClick={() => {
                                    handleAddOptionCard(
                                      stepIndex,
                                      questionIndex,
                                      cardIndex
                                    );
                                  }}
                                >
                                  Add Option
                                </button>
                              )}

                              {card.type === "imageAttribute" && (
                                <div>
                                  <label className="type-label">
                                    Attributes
                                  </label>
                                  <button
                                    className="type-button"
                                    onClick={() => {
                                      handleCardAddAttribute(
                                        stepIndex,
                                        questionIndex,
                                        cardIndex,
                                        "image"
                                      );
                                    }}
                                  >
                                    Add Attribute
                                  </button>

                                  <div style={{ marginBottom: "20px" }}>
                                    {card.attributes.map(
                                      (attribute, attributeIndex) => (
                                        <div key={attributeIndex}>
                                          <input type="file" />
                                          <input
                                            type="text"
                                            className="type-input"
                                            placeholder="Attribute Name"
                                            value={attribute.name}
                                            onChange={(e) => {
                                              handleCardAttributeChange(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex,
                                                "name",
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <input
                                            type="text"
                                            className="type-input"
                                            placeholder="Attribute Value"
                                            value={attribute.value}
                                            onChange={(e) => {
                                              handleCardAttributeChange(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex,
                                                "value",
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <Delete
                                            onClick={() => {
                                              handleCardDeleteAttribute(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex
                                              );
                                            }}
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {card.type === "attributes" && (
                                <div>
                                  <label className="type-label">
                                    Attributes
                                  </label>
                                  <button
                                    className="type-button"
                                    onClick={() => {
                                      handleCardAddAttribute(
                                        stepIndex,
                                        questionIndex,
                                        cardIndex
                                      );
                                    }}
                                  >
                                    Add Attribute
                                  </button>

                                  <div style={{ marginBottom: "20px" }}>
                                    {card.attributes.map(
                                      (attribute, attributeIndex) => (
                                        <div key={attributeIndex}>
                                          <input
                                            type="text"
                                            className="type-input"
                                            placeholder="Attribute Name"
                                            value={attribute.name}
                                            onChange={(e) => {
                                              handleCardAttributeChange(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex,
                                                "name",
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <input
                                            type="text"
                                            className="type-input"
                                            placeholder="Attribute Value"
                                            value={attribute.value}
                                            onChange={(e) => {
                                              handleCardAttributeChange(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex,
                                                "value",
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <Delete
                                            onClick={() => {
                                              handleCardDeleteAttribute(
                                                stepIndex,
                                                questionIndex,
                                                cardIndex,
                                                attributeIndex
                                              );
                                            }}
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                              {card.type === "select" && (
                                <div className="drop-down-option-container">
                                  {card.options.map((option, optionIndex) => (
                                    <div key={optionIndex}>
                                      <input
                                        className="type-input"
                                        type="text"
                                        placeholder="Enter Option"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...card.options];
                                          newOptions[optionIndex] =
                                            e.target.value;
                                          handleCardQuestionChange(
                                            stepIndex,
                                            questionIndex,
                                            cardIndex,
                                            "options",
                                            newOptions
                                          );
                                        }}
                                      />
                                      <Delete
                                        onClick={() => {
                                          handleDeleteOptionCard(
                                            stepIndex,
                                            questionIndex,
                                            cardIndex,
                                            optionIndex
                                          );
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {card.type === "radio" && (
                                <div className="drop-down-option-container">
                                  {card.options.map((option, optionIndex) => (
                                    <div key={optionIndex}>
                                      <input
                                        className="type-input"
                                        type="text"
                                        placeholder="Enter Option"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...card.options];
                                          newOptions[optionIndex] =
                                            e.target.value;
                                          handleCardQuestionChange(
                                            stepIndex,
                                            questionIndex,
                                            cardIndex,
                                            "options",
                                            newOptions
                                          );
                                        }}
                                      />
                                      <Delete
                                        onClick={() => {
                                          handleDeleteOptionCard(
                                            stepIndex,
                                            questionIndex,
                                            cardIndex,
                                            optionIndex
                                          );
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* Add similar input fields for other properties */}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      className="type-button"
                      onClick={() =>
                        handleDeleteQuestion(stepIndex, questionIndex)
                      }
                    >
                      Delete Question
                    </button>
                  </div>
                ))}
              <br />
              <button
                className="type-button"
                onClick={() => {
                  handleAddQuestion(stepIndex);
                  if (!steps[stepIndex].condition) {
                    handleExpandStep(stepIndex);
                  }
                }}
                style={{ marginTop: "10px" }}
              >
                Add Question
              </button>
            </div>
          ))}
          {/* <button className="type-button" onClick={handleAddStep}>
            Add Step
          </button> */}
          <button
            className="type-button"
            onClick={createType}
            disabled={Loading}
            style={{ width: "100%", marginTop: "10px" }}
          >
            {Loading ? "Loading..." : "Save Type"}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EditType;
