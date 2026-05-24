import express from 'express';
import passport from 'passport';
import { loginUser, registerUser, getMe, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  async (req, res) => {
    // Generate JWT and redirect to frontend
    const { generateToken } = await import('../utils/generateToken.js');
    generateToken(res, req.user._id);
    res.redirect(process.env.CLIENT_URL);
  }
);

export default router;