require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
const Equipment = require('../src/models/Equipment');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for seeding');
  await User.deleteMany({});
  await Equipment.deleteMany({});

  const pwd = await bcrypt.hash('password', 10);
  const users = [
    { name: 'Demo Student', email: 'student@demo.com', password: pwd, role: 'STUDENT' },
    { name: 'Demo Staff', email: 'staff@demo.com', password: pwd, role: 'STAFF' },
    { name: 'Demo Admin', email: 'admin@demo.com', password: pwd, role: 'ADMIN' }
  ];
  await User.insertMany(users);
  console.log('Inserted users');

  const equipments = [
    { name: 'Canon EOS 200D', category: 'Camera', condition: 'Good', totalQty: 3, availableQty: 3 },
    { name: 'Projector BenQ', category: 'AV', condition: 'Good', totalQty: 2, availableQty: 2 },
    { name: 'Microscope Model X', category: 'Lab', condition: 'Good', totalQty: 5, availableQty: 5 }
  ];
  await Equipment.insertMany(equipments);
  console.log('Inserted equipment');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
