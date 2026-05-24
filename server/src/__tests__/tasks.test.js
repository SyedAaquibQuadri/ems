import request from 'supertest';
import app from '../app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../config/testDb.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

beforeAll(async () => { await connectTestDB(); });
beforeEach(async () => { await clearTestDB(); });
afterAll(async () => { await closeTestDB(); });

// ─── Helpers ──────────────────────────────────────────────
const createAdmin = () => User.create({
  name: 'Admin', email: 'admin@ems.com', password: 'admin123', role: 'admin'
});

const createEmployee = () => User.create({
  name: 'Alice', email: 'alice@ems.com', password: 'emp123', role: 'employee'
});

const loginAs = async (email, password) => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  // Extract just the cookie string
  const cookies = res.headers['set-cookie'];
  if (!cookies) throw new Error(`Login failed for ${email}: ${JSON.stringify(res.body)}`);
  return cookies[0]; // return first cookie string
};

// ─── Test suite ───────────────────────────────────────────
describe('Tasks API', () => {

  describe('POST /api/tasks', () => {

    it('admin should create a task', async () => {
      await createAdmin();
      const employee = await createEmployee();
      const cookie = await loginAs('admin@ems.com', 'admin123');

      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookie)
        .send({
          title: 'Test Task',
          description: 'Test description',
          assignedTo: employee._id.toString(),
          priority: 'high',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Task');
      expect(res.body).toHaveProperty('status', 'new');
      expect(res.body).toHaveProperty('priority', 'high');
    });

    it('employee should not create a task', async () => {
      await createAdmin();
      const employee = await createEmployee();
      const cookie = await loginAs('alice@ems.com', 'emp123');

      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookie)
        .send({
          title: 'Sneaky Task',
          assignedTo: employee._id.toString(),
        });

      expect(res.statusCode).toBe(403);
    });

    it('should not create task without auth', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'No auth task' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {

    it('admin should get all tasks', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      await Task.create({
        title: 'Task 1', assignedTo: employee._id,
        assignedBy: admin._id, status: 'new', priority: 'low'
      });

      const cookie = await loginAs('admin@ems.com', 'admin123');
      const res = await request(app).get('/api/tasks').set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('title', 'Task 1');
      expect(res.body[0].assignedTo).toHaveProperty('name', 'Alice');
    });

    it('employee should not access all tasks', async () => {
      await createAdmin();
      await createEmployee();
      const cookie = await loginAs('alice@ems.com', 'emp123');

      const res = await request(app).get('/api/tasks').set('Cookie', cookie);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/tasks/my', () => {

    it('employee should get only their tasks', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      await Task.create({
        title: 'Alice Task', assignedTo: employee._id,
        assignedBy: admin._id, status: 'new', priority: 'medium'
      });

      const cookie = await loginAs('alice@ems.com', 'emp123');
      const res = await request(app).get('/api/tasks/my').set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0]).toHaveProperty('title', 'Alice Task');
      expect(res.body.summary).toHaveProperty('new', 1);
      expect(res.body.summary).toHaveProperty('completed', 0);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {

    it('employee should update their task status', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      const task = await Task.create({
        title: 'Status Task', assignedTo: employee._id,
        assignedBy: admin._id, status: 'new', priority: 'low'
      });

      const cookie = await loginAs('alice@ems.com', 'emp123');

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .set('Cookie', cookie)
        .send({ status: 'active' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'active');
    });

    it('should reject invalid status value', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      const task = await Task.create({
        title: 'Bad Status Task', assignedTo: employee._id,
        assignedBy: admin._id, status: 'new', priority: 'low'
      });

      const cookie = await loginAs('alice@ems.com', 'emp123');

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .set('Cookie', cookie)
        .send({ status: 'invalid_status' });

      expect(res.statusCode).toBe(400);
    });

    it('employee should not update someone elses task', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      const task = await Task.create({
        title: 'Not Alice Task', assignedTo: admin._id,
        assignedBy: admin._id, status: 'new', priority: 'low'
      });

      const cookie = await loginAs('alice@ems.com', 'emp123');

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .set('Cookie', cookie)
        .send({ status: 'active' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {

    it('admin should delete a task', async () => {
      const admin = await createAdmin();
      const employee = await createEmployee();

      const task = await Task.create({
        title: 'Delete Me', assignedTo: employee._id,
        assignedBy: admin._id, status: 'new', priority: 'low'
      });

      const cookie = await loginAs('admin@ems.com', 'admin123');

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task deleted successfully');

      const deleted = await Task.findById(task._id);
      expect(deleted).toBeNull();
    });
  });
});