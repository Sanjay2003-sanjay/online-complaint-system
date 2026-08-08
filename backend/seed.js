const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint-system');
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const password = 'Admin123!';
  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@complaints.com',
    password: hashed,
    role: 'admin',
    active: true,
  });

  console.log(`Admin created: ${admin.email} / ${password}`);
  process.exit(0);
})();
