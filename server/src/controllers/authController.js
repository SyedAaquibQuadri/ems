import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import initFirebase from '../config/firebase.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password, superAdminCode } = req.body
  try {
    const user = await User.findOne({ email }).populate('organizationId', 'name slug')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (user.role === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval from admin.' })
    }
    if (
      superAdminCode &&
      superAdminCode === process.env.SUPER_ADMIN_CODE &&
      email === process.env.SUPER_ADMIN_EMAIL &&
      user.role !== 'super_admin'
    ) {
      user.role = 'super_admin'
      await user.save()
    }
    generateToken(res, user._id)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?._id,
      orgName: user.organizationId?.name,
      orgSlug: user.organizationId?.slug,
      token,
    })
  } catch (error) {
    console.error('forgotPassword error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create user in Firebase Auth
    try {
      const admin = initFirebase()
      await admin.auth().createUser({ email, password, displayName: name })
    } catch (firebaseErr) {
      console.error('Firebase user creation error:', firebaseErr.message)
    }

    const user = await User.create({ name, email, password, role: 'pending' })
    generateToken(res, user._id)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('organizationId', 'name slug')
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?._id,
      orgName: user.organizationId?.name,
      orgSlug: user.organizationId?.slug,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) })
  res.json({ message: 'Logged out successfully' })
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if account exists
      return res.json({ message: 'If that email is registered, a reset link is on its way.' })
    }

    if (user.googleId) {
      return res.status(400).json({ message: 'google_account' })
    }

    // Generate token and save to DB
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 minutes
    await user.save()

    // Send email via nodemailer
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendEmail({
      to: email,
      subject: 'Reset your EMS password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below. It expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, ignore this email.</p>
      `
    })

    res.json({ message: 'If that email is registered, a reset link is on its way.' })
  } catch (error) {
    console.error('forgotPassword error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc   Check if email exists and what provider it uses
// @route  GET /api/auth/check-email
// @access Public
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal whether the account exists — security best practice
      return res.json({ provider: 'unknown' })
    }

    const provider = user.googleId ? 'google' : 'password'
    return res.json({ provider })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { password } = req.body
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }
    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()
    res.json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}