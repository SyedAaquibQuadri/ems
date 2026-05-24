import request from 'supertest';
import app from '../app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../config/testDb.js';
import User from '../models/User.js';

// Runs once before all tests in this file
beforeAll(async () => {
  await connectTestDB();
});

// Runs before each individual test — clean slate
beforeEach(async () => {
  await clearTestDB();
});

// Runs once after all tests — close connection
afterAll(async () => {
  await closeTestDB();
});

// ─── Test suite ───────────────────────────────────────────
describe('Auth API', () => {

  // Helper — create a user we can test with
  const createUser = async (role = 'employee') => {
    return await User.create({
      name: 'Test User',
      email: 'test@ems.com',
      password: 'password123',
      role,
    });
  };

  // ── POST /api/auth/login ──────────────────────────────
  describe('POST /api/auth/login', () => {

    it('should login with valid credentials', async () => {
      await createUser('admin');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@ems.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'test@ems.com');
      expect(res.body).toHaveProperty('role', 'admin');
      expect(res.body).not.toHaveProperty('password'); // never expose password
      expect(res.headers['set-cookie']).toBeDefined();  // JWT cookie set
    });

    it('should fail with wrong password', async () => {
      await createUser();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@ems.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@ems.com', password: 'password123' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@ems.com' }); // no password

      expect(res.statusCode).toBe(401);
    });
  });

  // ── GET /api/auth/me ──────────────────────────────────
  describe('GET /api/auth/me', () => {

    it('should return current user when authenticated', async () => {
      await createUser('admin');

      // Login first to get cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@ems.com', password: 'password123' });

      const cookie = loginRes.headers['set-cookie'];

      // Use cookie on next request
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'test@ems.com');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  // ── POST /api/auth/logout ─────────────────────────────
  describe('POST /api/auth/logout', () => {

    it('should logout and clear cookie', async () => {
      await createUser('admin');

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@ems.com', password: 'password123' });

      const cookie = loginRes.headers['set-cookie'];

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});