const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all unsold products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isSold: false })
            .populate('owner', 'name profilePhoto')
            .sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get current user's products
router.get('/my-products', protect, async (req, res) => {
    try {
        const products = await Product.find({ owner: req.user._id }).sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Add a new product (with image upload)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, condition, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'Please upload an image' });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            image: `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`,
            condition,
            category,
            owner: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: { product: newProduct }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Mark product as sold
router.patch('/:id/sell', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Only owner can mark as sold
        if (product.owner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }

        product.isSold = true;
        await product.save();

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router;
