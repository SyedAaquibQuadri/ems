import Organization from './models/Organization.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');

  await User.deleteMany();
  await Task.deleteMany();
  await Organization.deleteMany();

  // Create demo organization
  const org = await Organization.create({
    name: 'EMS Demo Company',
    slug: 'ems-demo',
  })

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ems.com',
    password: 'admin123',
    role: 'org_admin',
    organizationId: org._id,
  })

  org.owner = admin._id
  await org.save()

  // Create employees
  const employees = await Promise.all([
    User.create({ name: 'Alice Johnson', email: 'alice@ems.com', password: 'emp123', role: 'employee', organizationId: org._id }),
    User.create({ name: 'Bob Smith',     email: 'bob@ems.com',   password: 'emp123', role: 'employee', organizationId: org._id }),
    User.create({ name: 'Carol White',   email: 'carol@ems.com', password: 'emp123', role: 'employee', organizationId: org._id }),
  ])

  // Create tasks
  await Task.insertMany([
    { title: 'Design landing page',   description: 'Create UI mockups',        assignedTo: employees[0]._id, assignedBy: admin._id, organizationId: org._id, status: 'new',       priority: 'high' },
    { title: 'Fix login bug',         description: 'Auth token not persisting', assignedTo: employees[0]._id, assignedBy: admin._id, organizationId: org._id, status: 'active',    priority: 'high' },
    { title: 'Write API docs',        description: 'Document all endpoints',    assignedTo: employees[1]._id, assignedBy: admin._id, organizationId: org._id, status: 'completed', priority: 'medium' },
    { title: 'Setup CI pipeline',     description: 'GitHub Actions config',     assignedTo: employees[1]._id, assignedBy: admin._id, organizationId: org._id, status: 'new',       priority: 'low' },
    { title: 'Database optimization', description: 'Add indexes to models',     assignedTo: employees[2]._id, assignedBy: admin._id, organizationId: org._id, status: 'failed',    priority: 'medium' },
  ])

  console.log('✅ Seed complete')
  console.log('Org slug:       ems-demo')
  console.log('Admin login:    admin@ems.com / admin123')
  console.log('Employee login: alice@ems.com / emp123')
  process.exit()
}