// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";

// Page Imports
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";
import PublicRoute from "./routes/PublicRoute"; // Import the new guard

// ... The Dashboard component remains the same as before ...
const Dashboard = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user?.role === "client") return <Navigate to="/client" replace />;
  if (user?.role === "freelancer") return <Navigate to="/freelancer" replace />;
  return <Navigate to="/login" replace />;
};


const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes - Now protected by PublicRoute */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Post-login redirect hub */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Role-specific dashboards */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <RoleGuard allow={["client"]}>
                <ClientDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute>
              <RoleGuard allow={["freelancer"]}>
                <FreelancerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default App;