// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  // If the user is logged in, redirect them away from the public page
  // to the central dashboard.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is not logged in, show the public page.
  return children;
};

export default PublicRoute;