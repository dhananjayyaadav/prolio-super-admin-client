import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Re-use/Loader";
import "./CreateTypes.css";

function ViewTypes() {
  const [loading, setLoading] = useState(false);
  const apiURL = process.env.REACT_APP_API_URL;
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${apiURL}/type/types`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setTypes(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEditClick = (id) => {
    navigate(`/admin/edit-type/${id}`);
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "0.75rem",
    borderBottom: "2px solid #e0e0e0",
  };

  const tdStyle = {
    padding: "0.75rem",
    borderBottom: "1px solid #e0e0e0",
  };

  const editButtonStyle = {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>Type Table</h2>
            <p style={{ color: "#6c757d", margin: "0.5rem 0 0" }}>
              Manage and view all types
            </p>
          </div>
          <button
            style={buttonStyle}
            onClick={() => navigate("/admin/add-type")}
          >
            Add New Entry
          </button>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <p>Loading...</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "80%" }}>Type Name</th>
                <th style={{ ...thStyle, width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type._id}>
                  <td style={tdStyle}>{type.typeName}</td>
                  <td style={tdStyle}>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEditClick(type._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ViewTypes;
