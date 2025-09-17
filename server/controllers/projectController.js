// controllers/projectController.js
import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // The authMiddleware provides the logged-in user's info on req.user
    const project = new Project({
      title,
      description,
      budget,
      client: req.user._id, // Assign the project to the logged-in client
    });

    await project.save();

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

export const getOpenProjects = async (req, res) => {
  try {
    // Find projects with status 'open'
    // Populate client info, but only select their name and profile picture
    // Sort by newest first
    const projects = await Project.find({ status: 'open' })
      .populate('client', 'name profilePictureUrl')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Get open projects error:', err.message);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name profilePictureUrl')
      .populate('freelancer', 'name profilePictureUrl skills');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Get project by ID error:', err.message);
    // If the ID format is invalid, it might throw an error
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // Find projects where the logged-in user is either the client or the freelancer
    const projects = await Project.find({
      $or: [{ client: req.user._id }, { freelancer: req.user._id }],
    })
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Get my projects error:', err.message);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
};