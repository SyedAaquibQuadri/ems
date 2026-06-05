import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  console.log('[AUTH] cookie jwt:', req.cookies.jwt)
  console.log('[AUTH] auth header:', req.headers.authorization)
  console.log('[AUTH] token found:', token)
  console.log('[AUTH] JWT_SECRET exists:', !!process.env.JWT_SECRET)
  console.log('[AUTH] JWT_SECRET length:', process.env.JWT_SECRET?.length)

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  console.log('[AUTH] decoded:', decoded)
  req.user = await User.findById(decoded.id).select('-password')
  console.log('[AUTH] user found:', req.user?._id)
  next()
} catch (error) {
  console.log('[AUTH] verify error:', error.message)
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