const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user.model');
const Client = require('../models/client.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Client.deleteMany({});

  const users = await User.create([
    { name: 'Usman Sheikh', email: 'admin@nexus.io',  password: 'admin123',  role: 'admin'  },
    { name: 'Sarah Johnson', email: 'agent@nexus.io',  password: 'agent123',  role: 'agent'  },
    { name: 'Mike Chen',     email: 'viewer@nexus.io', password: 'viewer123', role: 'viewer' },
  ]);

  const [admin, agent] = users;

  await Client.create([
    {
      name: 'John Smith',
      company: 'Gulf Ventures',
      email: 'john.smith@gulf.io',
      status: 'active',
      priority: 'high',
      value: 18500,
      source: 'referral',
      assignedTo: agent._id,
      createdBy: admin._id,
    },
    {
      name: 'Emma Davis',
      company: 'TechBridge LLC',
      email: 'emma.davis@techbridge.io',
      status: 'lead',
      priority: 'high',
      value: 32000,
      source: 'cold-outreach',
      assignedTo: agent._id,
      createdBy: admin._id,
    },
    {
      name: 'David Lee',
      company: 'Elevate SaaS',
      email: 'david.lee@elevate.io',
      status: 'active',
      priority: 'medium',
      value: 9400,
      source: 'website',
      assignedTo: admin._id,
      createdBy: admin._id,
    },
    {
      name: 'Lisa Wang',
      company: 'DataAxis',
      email: 'lisa.wang@dataaxis.io',
      status: 'inactive',
      priority: 'low',
      value: 5000,
      source: 'social',
      assignedTo: agent._id,
      createdBy: admin._id,
    },
    {
      name: 'Tom Anderson',
      company: 'NovaRetail',
      email: 'tom.anderson@novar.io',
      status: 'lead',
      priority: 'medium',
      value: 14000,
      source: 'referral',
      assignedTo: agent._id,
      createdBy: admin._id,
    },
    {
      name: 'Anna Martinez',
      company: 'ClearPath AI',
      email: 'anna.m@clearpath.io',
      status: 'closed',
      priority: 'low',
      value: 22000,
      source: 'referral',
      assignedTo: admin._id,
      createdBy: admin._id,
    },
    {
      name: 'James Wilson',
      company: 'BrightSpace Co.',
      email: 'j.wilson@bright.io',
      status: 'active',
      priority: 'high',
      value: 41000,
      source: 'website',
      assignedTo: admin._id,
      createdBy: admin._id,
    },
    {
      name: 'Rachel Kim',
      company: 'Kinetic Systems',
      email: 'r.kim@kinetic.io',
      status: 'lead',
      priority: 'medium',
      value: 7800,
      source: 'cold-outreach',
      assignedTo: agent._id,
      createdBy: admin._id,
    },
  ]);

  console.log('Seeded 3 users and 8 clients');
  console.log('\nDemo logins:');
  console.log('  admin@nexus.io  / admin123');
  console.log('  agent@nexus.io  / agent123');
  console.log('  viewer@nexus.io / viewer123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
