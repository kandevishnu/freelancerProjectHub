// src/pages/FreelancerDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To personalize the welcome message

const FreelancerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name || 'Freelancer'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's a summary of your activity. Ready to find your next project?
        </p>
      </div>

      {/* Main Action to Find Work */}
      <div className="bg-blue-50 p-6 rounded-lg text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Find Your Next Opportunity
        </h2>
        <p className="text-blue-700 mb-6">
          Browse hundreds of open projects and submit your proposal to land your
          next client.
        </p>
        <Link
          to="/marketplace"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Browse Open Projects
        </Link>
      </div>

      {/* Placeholder for future sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">My Active Projects</h3>
          <p className="text-gray-500">
            You don't have any active projects yet.
          </p>
          {/* We will map over active projects here in the future */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">My Submitted Proposals</h3>
          <p className="text-gray-500">No proposals submitted yet.</p>
          {/* We will map over submitted proposals here in the future */}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;