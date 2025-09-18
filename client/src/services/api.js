// src/services/api.js
import axios from 'axios';

// We can create a reusable error handler
const handleError = (error) => {
  const message = error.response?.data?.error || error.response?.data?.message || error.message;
  console.error("API Error:", message);
  throw new Error(message);
};

// --- Project API Calls ---

export const createProject = async (projectData) => {
  try {
    const res = await axios.post('/api/projects', projectData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOpenProjects = async () => {
  try {
    const res = await axios.get('/api/projects');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProjectById = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// --- Proposal API Calls ---

export const submitProposal = async (projectId, proposalData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/proposals`, proposalData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProposalsForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/proposals`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateProposalStatus = async (proposalId, status) => {
  try {
    const res = await axios.patch(`/api/proposals/${proposalId}`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyProjects = async () => {
  try {
    const res = await axios.get('/api/projects/my');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// --- Task API Calls ---

export const getTasksForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/tasks`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createTask = async (projectId, taskData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/tasks`, taskData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const res = await axios.patch(`/api/projects/${projectId}/tasks/${taskId}`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// --- Deliverable API Calls ---

export const getDeliverablesForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/deliverables`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadDeliverable = async (projectId, formData) => {
  try {
    // For file uploads, it's safest to manually construct the headers
    // to ensure both Content-Type and Authorization are present.
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        // The Authorization header was missing. It's added here.
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.post(`/api/projects/${projectId}/deliverables`, formData, config);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};