import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt

  // Also check Authorization header (for cross-domain Google OAuth)
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'org_admin' || req.user.role === 'super_admin')) {
    next()
  } else {
    res.status(403).json({ message: 'Not authorized as admin' })
  }
};