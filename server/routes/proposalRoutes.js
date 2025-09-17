// routes/proposalRoutes.js
import express from 'express';
import { updateProposalStatus } from '../controllers/proposalController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   PATCH /api/proposals/:proposalId
// @desc    Accept or reject a proposal
// @access  Private (Client owner only)
router.patch('/:proposalId', auth, updateProposalStatus);

export default router;