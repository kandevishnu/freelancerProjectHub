// routes/deliverableRoutes.js
import express from 'express';
import { getDeliverablesForProject, uploadDeliverable } from '../controllers/deliverableController.js';
import auth from '../middleware/authMiddleware.js';
import upload from '../config/upload.js';

const router = express.Router({ mergeParams: true });

router.get('/', auth, getDeliverablesForProject);

// @route   POST /api/projects/:projectId/deliverables
// @desc    Upload a deliverable for a project
// @access  Private (Freelancer only)
router.post('/', auth, upload.single('deliverable'), uploadDeliverable);

export default router;