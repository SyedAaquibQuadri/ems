import Organization from '../models/Organization.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Generate unique slug from org name
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// @desc    Create organization + first admin
// @route   POST /api/org/register
export const createOrganization = async (req, res) => {
  const { orgName, name, email, password } = req.body

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Generate unique slug
    let slug = generateSlug(orgName)
    const slugExists = await Organization.findOne({ slug })
    if (slugExists) slug = `${slug}-${Date.now()}`

    // Create organization
    const org = await Organization.create({ name: orgName, slug })

    // Create org admin
    const user = await User.create({
      name,
      email,
      password,
      role: 'org_admin',
      organizationId: org._id,
    })

    // Set owner
    org.owner = user._id
    await org.save()

    generateToken(res, user._id)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: org._id,
      orgName: org.name,
      orgSlug: org.slug,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Join organization as pending employee
// @route   POST /api/org/join
export const joinOrganization = async (req, res) => {
  const { orgSlug, name, email, password } = req.body

  try {
    // Find organization by slug
    const org = await Organization.findOne({ slug: orgSlug.toLowerCase() })
    if (!org) {
      return res.status(404).json({ message: 'Organization not found. Check the organization code.' })
    }

    // Check if email already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create pending employee
    const user = await User.create({
      name,
      email,
      password,
      role: 'pending',
      organizationId: org._id,
    })

    res.status(201).json({
      message: `Request sent to ${org.name}. Wait for admin approval.`,
      orgName: org.name,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get current organization details
// @route   GET /api/org/me
export const getMyOrg = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId)
    if (!org) return res.status(404).json({ message: 'Organization not found' })
    res.json(org)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create org for an already-authenticated org_admin (Google OAuth flow)
// @route   POST /api/org/setup
export const setupOrganization = async (req, res) => {
  const { orgName } = req.body
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role !== 'org_admin') return res.status(403).json({ message: 'Not authorized' })
    if (user.organizationId) return res.status(400).json({ message: 'Organization already set up' })

    // Generate unique slug
    let slug = generateSlug(orgName)
    const slugExists = await Organization.findOne({ slug })
    if (slugExists) slug = `${slug}-${Date.now()}`

    // Create org and link to existing user
    const org = await Organization.create({ name: orgName, slug, owner: user._id })
    user.organizationId = org._id
    await user.save()

    res.json({
      organizationId: org._id,
      orgName: org.name,
      orgSlug: org.slug,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}