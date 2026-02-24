const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `lost-found-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Get all lost/found items
router.get('/', async (req, res) => {
    try {
        const items = await LostFound.find()
            .populate('reporter', 'name email')
            .sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: { items }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Create lost/found item
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const itemData = {
            ...req.body,
            reporter: req.user._id
        };

        if (req.file) {
            itemData.image = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
        }

        const newItem = await LostFound.create(itemData);

        res.status(201).json({
            status: 'success',
            data: { item: newItem }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Claim an item
router.patch('/:id/claim', protect, async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                status: 'fail',
                message: 'Item not found'
            });
        }

        if (item.status === 'claimed') {
            return res.status(400).json({
                status: 'fail',
                message: 'Item is already claimed'
            });
        }

        item.status = 'claimed';
        item.claimedBy = req.user._id;
        item.claimNote = req.body.claimNote;
        await item.save();

        res.status(200).json({
            status: 'success',
            data: { item }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router;
