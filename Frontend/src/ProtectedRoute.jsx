import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
