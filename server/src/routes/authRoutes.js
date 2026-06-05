import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser, getMe, logoutUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/check-email', checkEmail);

router.get('/google', (req, res, next) => {
  const state = req.query.state || '';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: state       // passes state through Google and back to callback
  })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}?error=google_failed`,
    session: false
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Redirect based on role
    if (req.user.role === 'org_admin' && !req.user.organizationId) {
      // Admin needs to complete company setup
      res.redirect(`${process.env.CLIENT_URL}/company-setup?token=${token}`);
    } else {
      // Employee goes straight to dashboard
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    }
  }
);

export default router;