const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A product must have a description']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    image: {
        type: String, // URL of the image
        required: [true, 'A product must have an image']
    },
    condition: {
        type: Number, // How many months old
        required: [true, 'Please specify how many months old the product is']
    },
    category: {
        type: String,
        required: [true, 'A product must have a category'],
        enum: ['Electronics', 'Books', 'Furniture', 'Clothing', 'Other']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A product must belong to a user']
    },
    isSold: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically populate owner info when querying products
productSchema.pre(/^find/, function () {
    this.populate({
        path: 'owner',
        select: 'name email'
    });
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
