import express from 'express'
import {
  getEmployees,
  getAllUsers,
  getPendingUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/',               protect, adminOnly, getAllUsers)
router.get('/employees',      protect, adminOnly, getEmployees)
router.get('/pending',        protect, adminOnly, getPendingUsers)
router.patch('/:id/role',     protect, adminOnly, updateUserRole)
router.delete('/:id',         protect, adminOnly, deleteUser)

export default router