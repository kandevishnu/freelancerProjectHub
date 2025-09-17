// routes/taskRoutes.js
import express from 'express';
import { createTask, getTasksForProject, updateTaskStatus  } from '../controllers/taskController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', auth, getTasksForProject);

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task for a project
// @access  Private (Client or assigned Freelancer only)
router.post('/', auth, createTask);
router.patch('/:taskId', auth, updateTaskStatus);

export default router;