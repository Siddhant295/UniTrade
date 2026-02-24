const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Get all messages between current user and another user
router.get('/:otherUserId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.user._id }
            ]
        })
            .populate('sender receiver', 'name profilePhoto')
            .sort('createdAt');

        res.status(200).json({
            status: 'success',
            data: { messages }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Send a message
router.post('/', protect, async (req, res) => {
    try {
        const { receiverId, text, productId } = req.body;

        const newMessage = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            text,
            productId
        });

        res.status(201).json({
            status: 'success',
            data: { message: newMessage }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get all recent chats for current user
router.get('/conversations/recent', protect, async (req, res) => {
    try {
        // Find all users the current user has messaged or received messages from
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }).sort('-createdAt');

        const chatPartners = new Set();
        const recentChats = [];

        for (const msg of messages) {
            const partnerId = msg.sender.toString() === req.user._id.toString()
                ? msg.receiver.toString()
                : msg.sender.toString();

            if (!chatPartners.has(partnerId)) {
                chatPartners.add(partnerId);
                const partner = await User.findById(partnerId);
                recentChats.push({
                    partner,
                    lastMessage: msg
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: { recentChats }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router;
