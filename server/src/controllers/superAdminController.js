import Organization from '../models/Organization.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// @desc    Get platform stats
// @route   GET /api/super/stats
export const getPlatformStats = async (req, res) => {
  try {
    const [totalOrgs, totalUsers, totalTasks] = await Promise.all([
      Organization.countDocuments(),
      User.countDocuments(),
      Task.countDocuments(),
    ])
    res.json({ totalOrgs, totalUsers, totalTasks })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all organizations with details
// @route   GET /api/super/orgs
export const getAllOrgs = async (req, res) => {
  try {
    const orgs = await Organization.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })

    // Get member and task counts for each org
    const orgsWithStats = await Promise.all(orgs.map(async (org) => {
      const [memberCount, taskCount] = await Promise.all([
        User.countDocuments({ organizationId: org._id }),
        Task.countDocuments({ organizationId: org._id }),
      ])
      return {
        _id: org._id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        isActive: org.isActive,
        owner: org.owner,
        memberCount,
        taskCount,
        createdAt: org.createdAt,
      }
    }))

    res.json(orgsWithStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all members of an org
// @route   GET /api/super/orgs/:id/members
export const getOrgMembers = async (req, res) => {
  try {
    const members = await User.find({ organizationId: req.params.id })
      .select('-password')
      .sort({ createdAt: -1 })
    res.json(members)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete an organization
// @route   DELETE /api/super/orgs/:id
export const deleteOrg = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id)
    if (!org) return res.status(404).json({ message: 'Organization not found' })

    // Delete all users and tasks in org
    await User.deleteMany({ organizationId: req.params.id })
    await Task.deleteMany({ organizationId: req.params.id })
    await org.deleteOne()

    res.json({ message: 'Organization deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}