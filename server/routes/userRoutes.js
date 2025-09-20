import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { updateMe, getUserProfile, sendConnectionRequest, getConnectionStatus   } from '../controllers/userController.js'; 

const router = express.Router();

router.patch('/me', auth, updateMe);
router.get('/:userId', getUserProfile);
router.post('/:userId/connect', auth, sendConnectionRequest);
router.get('/:userId/connection-status', auth, getConnectionStatus);


export default router;