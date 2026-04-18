require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({ email: { $in: ['seedcitizen1_1774766977@test.com','seedcitizen2_1774766977@test.com','seedofficial1_1774766977@test.com','seedofficial2_1774766977@test.com','seedadmin_1774766977@test.com'] } });
  const hash = await bcrypt.hash('Test1234', 10);
  await User.insertMany([
    { fullName: 'Seed Citizen One', email: 'seedcitizen1_1774766977@test.com', password: hash, location: 'Delhi', role: 'citizen', isVerified: true, isApproved: true },
    { fullName: 'Seed Citizen Two', email: 'seedcitizen2_1774766977@test.com', password: hash, location: 'Delhi', role: 'citizen', isVerified: true, isApproved: true },
    { fullName: 'Seed Official One', email: 'seedofficial1_1774766977@test.com', password: hash, location: 'Delhi', role: 'official', isVerified: true, isApproved: false },
    { fullName: 'Seed Official Two', email: 'seedofficial2_1774766977@test.com', password: hash, location: 'Delhi', role: 'official', isVerified: true, isApproved: true },
    { fullName: 'Seed Admin', email: 'seedadmin_1774766977@test.com', password: hash, location: 'Delhi', role: 'admin', isVerified: true, isApproved: true }
  ]);
  await mongoose.disconnect();
})();
