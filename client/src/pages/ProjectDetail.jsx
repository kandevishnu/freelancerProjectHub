// src/pages/ProjectDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProjectById, getTasksForProject, updateTaskStatus, submitProposal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProposalModal from '../components/ProposalModal';
import TaskBoard from '../components/TaskBoard';

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { projectId } = useParams();
  const { user } = useAuth();

  const fetchProjectAndTasks = useCallback(async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      if (projectData.status === 'in-progress') {
        const tasksData = await getTasksForProject(projectId);
        setTasks(tasksData);
      }
    } catch (err) {
      setError('Failed to fetch project details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [fetchProjectAndTasks]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(projectId, taskId, newStatus);
      toast.success('Task status updated!');
      const updatedTasks = await getTasksForProject(projectId);
      setTasks(updatedTasks);
    } catch (err) {
      toast.error(err.message || 'Failed to update task.');
    }
  };

  const handleProposalSubmit = async (proposalData) => {
    try {
      await submitProposal(projectId, proposalData);
      toast.success('Proposal submitted successfully!');
      setIsModalOpen(false);
      setHasSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit proposal.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading project details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!project) return <div className="text-center p-10">Project not found.</div>;

  const canSubmitProposal = user && user.role === 'freelancer' && project.status === 'open';

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <span className="bg-green-100 text-green-800 font-semibold px-4 py-1 rounded-full">
              Budget: ${project.budget}
            </span>
          </div>
          <div className="text-gray-500 mb-6">
            Posted by: <span className="font-medium text-gray-700">{project.client.name}</span>
          </div>
          <div className="prose max-w-none mb-6">
            <p>{project.description}</p>
          </div>

          {canSubmitProposal && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={hasSubmitted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {hasSubmitted ? 'Proposal Submitted' : 'Submit a Proposal'}
              </button>
            </div>
          )}
        </div>

        {project.status === 'in-progress' && (
          <TaskBoard tasks={tasks} onStatusChange={handleTaskStatusChange} />
        )}
      </div>

      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProposalSubmit}
      />
    </>
  );
};

export default ProjectDetail;