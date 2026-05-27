import express from 'express';
import {
  getPlatformStats,
  getAllOrgs,
  getOrgMembers,
  deleteOrg,
} from '../controllers/superAdminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { superAdminOnly } from '../middleware/superAdminMiddleware.js';

const router = express.Router();

router.get('/stats',              protect, superAdminOnly, getPlatformStats);
router.get('/orgs',               protect, superAdminOnly, getAllOrgs);
router.get('/orgs/:id/members',   protect, superAdminOnly, getOrgMembers);
router.delete('/orgs/:id',        protect, superAdminOnly, deleteOrg);

export default router;