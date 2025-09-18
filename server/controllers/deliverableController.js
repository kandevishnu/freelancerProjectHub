// controllers/deliverableController.js
import Deliverable from '../models/Deliverable.js';
import Project from '../models/Project.js';

export const uploadDeliverable = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description } = req.body;
    const userId = req.user._id;

    // 1. Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // 2. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // 3. Security Check: Ensure the user is the assigned freelancer for this project
    if (!project.freelancer || !project.freelancer.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not the freelancer for this project.' });
    }

    // 4. Create a new deliverable record
    const newDeliverable = new Deliverable({
      project: projectId,
      submittedBy: userId,
      description,
      fileUrl: req.file.path, // Get the file path from the multer middleware
    });

    await newDeliverable.save();

    res.status(201).json(newDeliverable);
  } catch (err) {
    console.error('Upload deliverable error:', err.message);
    res.status(500).json({ error: 'Server error while uploading deliverable.' });
  }
};

export const getDeliverablesForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // 1. Find the project to verify it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Security Check: Ensure user is the client or assigned freelancer
    const isClient = project.client.equals(userId);
    const isFreelancer = project.freelancer && project.freelancer.equals(userId);

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to view these deliverables' });
    }

    // 3. Find all deliverables for this project
    const deliverables = await Deliverable.find({ project: projectId })
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(deliverables);
  } catch (err) {
    console.error('Get deliverables error:', err.message);
    res.status(500).json({ error: 'Server error while fetching deliverables' });
  }
};