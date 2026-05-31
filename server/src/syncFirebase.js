import mongoose from 'mongoose'
import dotenv from 'dotenv'
import admin from './config/firebase.js'
import User from './models/User.js'

dotenv.config()

const syncUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB...')

  const users = await User.find({ googleId: { $exists: false } }).select('name email')
  console.log(`Found ${users.length} users to sync...`)

  let success = 0
  let skipped = 0

  for (const user of users) {
    try {
      // Check if already exists in Firebase
      await admin.auth().getUserByEmail(user.email)
      console.log(`⏭ Already exists: ${user.email}`)
      skipped++
    } catch {
      // Doesn't exist — create with temporary password
      try {
        await admin.auth().createUser({
          email: user.email,
          displayName: user.name,
          password: 'TempPass123!', // They'll reset via forgot password
        })
        console.log(`✅ Created: ${user.email}`)
        success++
      } catch (err) {
        console.log(`❌ Failed: ${user.email} — ${err.message}`)
      }
    }
  }

  console.log(`\nDone! Created: ${success}, Skipped: ${skipped}`)
  process.exit()
}

syncUsers().catch(err => { console.error(err); process.exit(1) })