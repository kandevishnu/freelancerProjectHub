// routes/proposalRoutes.js
import express from 'express';
import { submitProposal, getProposalsForProject  } from '../controllers/proposalController.js';
import auth from '../middleware/authMiddleware.js';

// The 'mergeParams: true' option allows this router to access URL params from parent routers
const router = express.Router({ mergeParams: true });

// @route   GET /api/projects/:projectId/proposals
// @desc    Get all proposals for a specific project
// @access  Private (Client owner only)
router.get('/', auth, getProposalsForProject);

// @route   POST /api/projects/:projectId/proposals
// @desc    Submit a proposal for a project
// @access  Private (Freelancers only)
router.post('/', auth, submitProposal);

export default router;