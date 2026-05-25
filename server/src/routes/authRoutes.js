import express from 'express';
import passport from 'passport';
import { loginUser, registerUser, getMe, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

// Google OAuth routes
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login`, 
    session: false 
  }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    // Redirect to frontend with token in URL
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export default router;