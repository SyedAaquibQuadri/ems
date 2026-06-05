import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('[3] Passport callback fired');
      console.log('[4] req.cookies:', req.cookies);
      console.log('[5] raw cookie header:', req.headers.cookie);
      try {
        let role = 'employee';
        let orgSlug = null;

        if (req.cookies?.oauth_state) {
          try {
            const decoded = JSON.parse(Buffer.from(req.cookies.oauth_state, 'base64').toString('utf8'));
            role = decoded.role || 'employee';
            orgSlug = decoded.companyCode || null;
          } catch {
            return done(new Error('Invalid OAuth state. Please try again.'), null);
          }
        }

        // Existing user by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Existing user by email — link Google to it
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
          return done(null, user);
        }

        // New user — validate org slug for employees
        let organizationId = null;
        let assignedRole = role === 'admin' ? 'org_admin' : 'employee';

        if (assignedRole === 'employee') {
          if (!orgSlug) {
            return done(new Error('Organization slug is required for employees.'), null);
          }
          const org = await Organization.findOne({ slug: orgSlug.toLowerCase() });
          if (!org) {
            return done(new Error('Invalid organization slug. Please check and try again.'), null);
          }
          if (!org.isActive) {
            return done(new Error('This organization is inactive.'), null);
          }
          organizationId = org._id;
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: Math.random().toString(36).slice(-8) + 'Aa1!',
          role: assignedRole,
          organizationId: organizationId,   // null for org_admin, real _id for employee
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;