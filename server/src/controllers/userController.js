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