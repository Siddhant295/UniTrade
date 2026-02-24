require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@iiit-bh.ac.in',
        password: 'password123',
        role: 'student'
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@iiit-bh.ac.in',
        password: 'password123',
        role: 'student'
    },
    {
        name: 'Admin User',
        email: 'admin@iiit-bh.ac.in',
        password: 'adminpassword',
        role: 'admin'
    }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unitrade';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        for (const userData of testUsers) {
            try {
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`User ${userData.email} already exists. Skipping.`);
                    continue;
                }

                await User.create(userData);
                console.log(`User created: ${userData.email}`);
            } catch (err) {
                console.error(`Error creating user ${userData.email}:`, err.message);
            }
        }

        console.log('Test users creation finished.');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
