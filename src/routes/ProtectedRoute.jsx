import React from "react";
import { Navigate } from "react-router-dom";
import getUserRole from "../utils/getUserRole"; // ✅ add this import


const ProtectedRoute = ({ children, allowedRoles }) => {
  const userId = localStorage.getItem("userId");
  const role = getUserRole(userId);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
