import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createReview } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });
router.post('/', auth, createReview);

export default router;
