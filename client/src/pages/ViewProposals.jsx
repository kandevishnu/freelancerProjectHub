// src/pages/ViewProposals.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProposalsForProject, updateProposalStatus, getProjectById } from '../services/api';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch both project details and proposals
      const projectData = await getProjectById(projectId);
      const proposalsData = await getProposalsForProject(projectId);
      setProject(projectData);
      setProposals(proposalsData);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (proposalId, status) => {
    try {
      await updateProposalStatus(proposalId, status);
      toast.success(`Proposal has been ${status}!`);
      // Redirect to the dashboard to see the updated project status
      navigate('/client');
    } catch (err) {
      toast.error(err.message || 'Failed to update proposal.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading proposals...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-2">Proposals for "{project?.title}"</h1>
      <p className="text-gray-600 mb-8">
        Review the proposals below and choose the best freelancer for your project.
      </p>

      {proposals.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No proposals have been submitted for this project yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onUpdateStatus={handleUpdateStatus}
              isProjectOpen={project?.status === 'open'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component for displaying a single proposal
const ProposalCard = ({ proposal, onUpdateStatus, isProjectOpen }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{proposal.freelancer.name}</h3>
          <p className="text-sm text-gray-500">{proposal.freelancer.email}</p>
        </div>
        <span className="text-2xl font-bold text-green-600">${proposal.bidAmount}</span>
      </div>
      <p className="my-4 text-gray-700">{proposal.coverLetter}</p>
      
      {/* Show buttons only if the project is still open */}
      {isProjectOpen && (
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => onUpdateStatus(proposal._id, 'rejected')}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={() => onUpdateStatus(proposal._id, 'accepted')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;