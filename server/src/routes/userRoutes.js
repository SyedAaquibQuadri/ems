import express from 'express';
import { getEmployees } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/employees', protect, adminOnly, getEmployees);

export default router;