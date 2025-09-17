import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ allow = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const role = (user.role || "").toLowerCase();
  const allowed = allow.map((r) => (r || "").toLowerCase());
  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
