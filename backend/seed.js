require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const LostFound = require('./models/LostFound');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unitrade';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data (optional, but good for a clean seed)
        // await User.deleteMany({});
        // await Product.deleteMany({});
        // await LostFound.deleteMany({});

        // Create Users
        const users = [
            {
                name: 'John Doe',
                email: 'john.doe@iiit-bh.ac.in',
                password: 'password123',
                role: 'student',
                profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@iiit-bh.ac.in',
                password: 'password123',
                role: 'student',
                profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'Siddhant Srivastav',
                email: 'sid.srivastav@iiit-bh.ac.in',
                password: 'password123',
                role: 'admin',
                profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
            }
        ];

        const createdUsers = [];
        for (const u of users) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
                console.log(`User created: ${u.email}`);
            } else {
                // Update profile photo if user already exists
                user.profilePhoto = u.profilePhoto;
                await user.save();
                console.log(`User updated: ${u.email}`);
            }
            createdUsers.push(user);
        }

        const john = createdUsers.find(u => u.email === 'john.doe@iiit-bh.ac.in');
        const jane = createdUsers.find(u => u.email === 'jane.smith@iiit-bh.ac.in');

        // Create Products
        const products = [
            {
                name: 'Premium Physics Textbook',
                description: 'Latest edition, includes digital resources and solved papers.',
                price: 350,
                image: 'https://images.unsplash.com/photo-1532012197367-bb83f5ff9379?auto=format&fit=crop&q=80&w=800',
                condition: 12,
                category: 'Books',
                owner: john._id
            },
            {
                name: 'Graphing Calculator Plus',
                description: 'Full-color display, support for advanced engineering mathematics.',
                price: 1200,
                image: 'https://images.unsplash.com/photo-1594673050483-66ba61988d89?auto=format&fit=crop&q=80&w=800',
                condition: 6,
                category: 'Electronics',
                owner: jane._id
            },
            {
                name: 'Ergonomic Desk Lamp',
                description: 'Minimalist design with three color temperatures and touch control.',
                price: 750,
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
                condition: 18,
                category: 'Furniture',
                owner: john._id
            }
        ];

        for (const p of products) {
            const existing = await Product.findOne({ name: p.name, owner: p.owner });
            if (!existing) {
                await Product.create(p);
                console.log(`Product created: ${p.name}`);
            } else {
                existing.image = p.image;
                existing.description = p.description;
                await existing.save();
                console.log(`Product updated: ${p.name}`);
            }
        }

        // Create Lost & Found Items
        const lostItems = [
            {
                title: 'Designer Navy Backpack',
                description: 'Left in Room 402. Contains electronics and a blue folder.',
                type: 'lost',
                category: 'Other',
                location: 'Room 402',
                reporter: jane._id,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Silver Mechanical Watch',
                description: 'Found near the Library entrance. Appears to be a Fossil model.',
                type: 'found',
                category: 'Accessories',
                location: 'Library Entrance',
                reporter: john._id,
                image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
            }
        ];

        for (const li of lostItems) {
            const existing = await LostFound.findOne({ title: li.title, reporter: li.reporter });
            if (!existing) {
                await LostFound.create(li);
                console.log(`Lost/Found item created: ${li.title}`);
            }
        }

        console.log('Seed finished successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedData();
