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
      passReqToCallback: true,        // <-- THIS is the key addition
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Decode state to get role and company code
        let role = 'employee';
        let companyCode = null;

        if (req.query.state) {
          try {
            const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf8'));
            role = decoded.role || 'employee';
            companyCode = decoded.slug || decoded.companyCode || null;
          } catch {
            return done(new Error('Invalid OAuth state. Please try again.'), null);
          }
        }

        // Check if user already exists by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Check if email already registered normally — link Google to it
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
          return done(null, user);
        }

        // New user — validate company code for employees
        let companyId = null;
        if (role === 'employee') {
          if (!companyCode) {
            return done(new Error('Company code is required for employees.'), null);
          }

          const organization = await Organization.findOne({ companyCode });
          if (!organization) {
            return done(new Error('Invalid company code. Please check and try again.'), null);
          }
          companyId = organization._id;
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: Math.random().toString(36).slice(-8) + 'Aa1!',
          role: role,
          companyId: companyId,   // null for admin, real ID for employee
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;