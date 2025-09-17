// routes/projectRoutes.js
import express from 'express';
import { createProject, getOpenProjects, getProjectById, getMyProjects } from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();


// @route   GET /api/projects
// @desc    Get all open projects for the marketplace
// @access  Public
router.get('/', getOpenProjects); 

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (requires authentication)
router.post('/', auth, createProject);

// @route   GET /api/projects/my
// @desc    Get projects for the logged-in user
// @access  Private
router.get('/my', auth, getMyProjects);

// @route   GET /api/projects/:id
// @desc    Get a single project by its ID
// @access  Public
router.get('/:id', getProjectById);


export default router;