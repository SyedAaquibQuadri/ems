import express from 'express';
import { createOrganization, joinOrganization, getMyOrg, setupOrganization } from '../controllers/orgController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createOrganization);
router.post('/join', joinOrganization);
router.get('/me', protect, getMyOrg);
router.post('/setup', protect, setupOrganization);

export default router;