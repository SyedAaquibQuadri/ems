import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import admin from '../config/firebase.js';

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

    // Super admin upgrade
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
      await admin.auth().createUser({ email, password, displayName: name })
    } catch (firebaseErr) {
      console.error('Firebase user creation error:', firebaseErr.message)
      // Continue even if Firebase fails — our DB is source of truth
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
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 minutes
    await user.save()

    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendEmail({
      to: user.email,
      subject: 'EMS Password Reset',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#1c1c1c;border-radius:16px;border:1px solid #2a2a2a;">
          <h2 style="color:#fff;margin-bottom:8px;">Reset your password</h2>
          <p style="color:#9ca3af;margin-bottom:24px;">Click the button below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">Reset Password</a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px;">If you didn't request this, ignore this email.</p>
        </div>
      `
    })

    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    res.status(500).json({ message: error.message })
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