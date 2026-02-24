const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: [true, 'Please specify if it is lost or found']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Electronics', 'Books', 'Identification', 'Keys', 'Clothing', 'Accessories', 'Other']
    },
    location: {
        type: String,
        required: [true, 'Please specify where it was lost/found']
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    },
    reporter: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'claimed', 'returned'],
        default: 'active'
    },
    claimedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    claimNote: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = LostFound;
