import User from '../models/User.js';

// @desc    Get all employees (admin only)
// @route   GET /api/users/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all users (admin only)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user role (admin only)
// @route   PATCH /api/users/:id/role
export const updateUserRole = async (req, res) => {
  const { role } = req.body
  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await user.deleteOne()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all pending users (admin only)
// @route   GET /api/users/pending
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'pending' }).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}