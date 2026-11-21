import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProposalsForProject, updateProposalStatus, getProjectById } from '../services/api';
import { Check, X, ArrowLeft, Clock, Banknote, User } from 'lucide-react';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'rejected' | 'all'
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, proposalsData] = await Promise.all([
        getProjectById(projectId),
        getProposalsForProject(projectId)
      ]);
      setProject(projectData);
      setProposals(proposalsData || []);

      // If no pending proposals, switch to all
      const hasPending = (proposalsData || []).some(p => p.status === 'pending');
      if (!hasPending && (proposalsData || []).length > 0) {
        setFilterTab('all');
      }
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

  const handleResponse = async (proposalId, status, freelancerName) => {
    try {
      await updateProposalStatus(proposalId, status);
      if (status === 'rejected') {
        toast.info(`Proposal from ${freelancerName || 'freelancer'} declined.`);
        // Immediately update proposal status in local state so actions disappear
        setProposals((prev) =>
          prev.map((p) => (p._id === proposalId ? { ...p, status: 'rejected' } : p))
        );
      } else if (status === 'accepted') {
        toast.success(`Hired ${freelancerName || 'freelancer'}! Opening workspace...`);
        navigate(`/project/${projectId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update proposal.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading proposals...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');
  const acceptedProposals = proposals.filter(p => p.status === 'accepted');

  const displayedProposals = proposals.filter(p => {
    if (filterTab === 'pending') return p.status === 'pending';
    if (filterTab === 'rejected') return p.status === 'rejected';
    return true; // 'all'
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top back navigation */}
      <div className="mb-4">
        <Link
          to="/client"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Project Proposals
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
              {project?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <Banknote size={15} className="text-emerald-600" />
                Budget: Rs. {Number(project?.budget || 0).toLocaleString('en-IN')}
              </span>
              <span>•</span>
              <span className="capitalize text-gray-600 font-medium">
                Status: {project?.status?.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {proposals.length} Total {proposals.length === 1 ? 'Proposal' : 'Proposals'}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending ({pendingProposals.length})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Declined ({rejectedProposals.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Proposals ({proposals.length})
          </button>
        </div>
      </div>

      {/* Proposals List */}
      {displayedProposals.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <h2 className="text-base font-semibold text-gray-800">
            {filterTab === 'pending'
              ? 'No pending proposals to review.'
              : filterTab === 'rejected'
              ? 'No declined proposals.'
              : 'No proposals submitted yet.'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filterTab === 'pending' && rejectedProposals.length > 0 && (
              <button
                onClick={() => setFilterTab('all')}
                className="text-blue-600 hover:underline font-medium ml-1"
              >
                View all proposals
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedProposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onRespond={handleResponse}
              isProjectOpen={project?.status === 'open'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProposalCard = ({ proposal, onRespond, isProjectOpen }) => {
  const isPending = proposal.status === 'pending';
  const isRejected = proposal.status === 'rejected';
  const isAccepted = proposal.status === 'accepted';

  return (
    <div className={`bg-white rounded-xl border transition-colors overflow-hidden ${
      isRejected ? 'border-gray-200 opacity-80' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {proposal.freelancer?.profilePictureUrl ? (
              <img
                src={proposal.freelancer.profilePictureUrl}
                alt={proposal.freelancer.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                {proposal.freelancer?.name?.charAt(0) || 'F'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${proposal.freelancer?._id}`}
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {proposal.freelancer?.name}
                </Link>

                {/* Status Badge */}
                {isRejected && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    <X size={12} className="text-red-500" /> Declined
                  </span>
                )}
                {isAccepted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check size={12} className="text-emerald-600" /> Accepted & Hired
                  </span>
                )}
                {isPending && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Pending Review
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {proposal.freelancer?.email}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 block">Bid Amount</span>
            <span className="text-xl font-bold text-emerald-700">
              Rs. {Number(proposal.bidAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Cover letter */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Cover Letter
          </p>
          <p>{proposal.coverLetter}</p>
        </div>
      </div>
      
      {/* Action Buttons ONLY when project is open and proposal is pending */}
      {isProjectOpen && isPending && (
        <div className="bg-gray-50/80 px-6 py-3.5 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={() => onRespond(proposal._id, 'rejected', proposal.freelancer?.name)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-300 hover:bg-red-50/40 font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <X size={14} /> Decline
          </button>
          <button
            onClick={() => onRespond(proposal._id, 'accepted', proposal.freelancer?.name)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Check size={14} /> Accept & Hire
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;
