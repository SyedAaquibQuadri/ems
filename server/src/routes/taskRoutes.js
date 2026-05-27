import express from 'express';
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskAnalytics,
} from '../controllers/taskController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',             protect, adminOnly, createTask);
router.get('/',              protect, adminOnly, getAllTasks);
router.get('/my',            protect, getMyTasks);
router.patch('/:id/status',  protect, updateTaskStatus);
router.get('/analytics', protect, adminOnly, getTaskAnalytics);
router.put('/:id',           protect, adminOnly, updateTask);
router.delete('/:id',        protect, adminOnly, deleteTask);

export default router;