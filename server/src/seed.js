import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Task from './models/Task.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');

  // Clear existing data
  await User.deleteMany();
  await Task.deleteMany();

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ems.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create employees
const employees = await Promise.all([
  User.create({ name: 'Alice Johnson', email: 'alice@ems.com', password: 'emp123', role: 'employee' }),
  User.create({ name: 'Bob Smith',     email: 'bob@ems.com',   password: 'emp123', role: 'employee' }),
  User.create({ name: 'Carol White',   email: 'carol@ems.com', password: 'emp123', role: 'employee' }),
]);

  // Create tasks
  await Task.insertMany([
    { title: 'Design landing page',   description: 'Create UI mockups',        assignedTo: employees[0]._id, assignedBy: admin._id, status: 'new',       priority: 'high' },
    { title: 'Fix login bug',         description: 'Auth token not persisting', assignedTo: employees[0]._id, assignedBy: admin._id, status: 'active',    priority: 'high' },
    { title: 'Write API docs',        description: 'Document all endpoints',    assignedTo: employees[1]._id, assignedBy: admin._id, status: 'completed', priority: 'medium' },
    { title: 'Setup CI pipeline',     description: 'GitHub Actions config',     assignedTo: employees[1]._id, assignedBy: admin._id, status: 'new',       priority: 'low' },
    { title: 'Database optimization', description: 'Add indexes to models',     assignedTo: employees[2]._id, assignedBy: admin._id, status: 'failed',    priority: 'medium' },
  ]);

  console.log('✅ Seed complete — 1 admin, 3 employees, 5 tasks created');
  console.log('Admin login:    admin@ems.com / admin123');
  console.log('Employee login: alice@ems.com / emp123');
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});