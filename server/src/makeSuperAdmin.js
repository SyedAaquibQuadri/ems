import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeSuperAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const user = await User.findOneAndUpdate(
    { email: 'syedaaquibquadri@gmail.com' },
    { role: 'super_admin' },
    { new: true }
  ).select('-password');

  if (!user) {
    console.log('❌ User not found')
  } else {
    console.log('✅ Super admin set for:', user.email)
    console.log('Role:', user.role)
  }
  process.exit()
}

makeSuperAdmin().catch(err => { console.error(err); process.exit(1) })