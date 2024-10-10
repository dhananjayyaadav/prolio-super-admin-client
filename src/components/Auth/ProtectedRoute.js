import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.token.token); // Get token from Redux state

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  return children; // Render the children if token exists
};

export default ProtectedRoute;
