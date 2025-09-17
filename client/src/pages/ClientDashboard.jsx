// src/pages/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProjects } from '../services/api';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMyProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch your projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="text-center p-10">Loading your dashboard...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <Link
          to="/project/new" // We will create this page next
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          + Create New Project
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p>You haven't posted any projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ClientProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for displaying a client's project
const ClientProjectCard = ({ project }) => {
  const statusStyles = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-sm text-gray-500">
          Assigned to: {project.freelancer?.name || 'Not yet assigned'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[project.status]}`}
        >
          {project.status.replace('-', ' ')}
        </span>
        {project.status === 'open' && (
          <Link
            to={`/project/${project._id}/proposals`} // We'll create this page later
            className="text-blue-600 hover:underline"
          >
            View Proposals
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;