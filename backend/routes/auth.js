const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

const OTP = require('../models/OTP');
const { sendWelcomeEmail, sendOTPEmail } = require('../utils/email');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage config for profile photos
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadProfile = multer({ storage: profileStorage });

// 1) Send OTP Route
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email.endsWith('@iiit-bh.ac.in')) {
            return res.status(400).json({
                status: 'fail',
                message: 'Only college emails (@iiit-bh.ac.in) are allowed.'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists with this email'
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({ email, otp });

        // Send Email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to your email'
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// 2) Signup Route (Now verifies OTP)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid or expired OTP'
            });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        // Delete OTP record after successful signup
        await OTP.deleteMany({ email });

        sendWelcomeEmail(newUser.email, newUser.name);
        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Update Profile Photo
router.patch('/update-photo', protect, uploadProfile.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'Please upload a photo' });
        }

        const photoUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
        const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: photoUrl }, { new: true });

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Google Login Route
router.post('/google', async (req, res) => {
    try {
        const { idToken, email: providedEmail, name: providedName } = req.body;
        let email, name;

        if (providedEmail && providedName) {
            // If frontend already verified and sent info (e.g. access_token flow)
            email = providedEmail;
            name = providedName;
        } else {
            // ID Token verification
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
        }

        // Check domain restriction
        if (!email.endsWith('@iiit-bh.ac.in')) {
            return res.status(400).json({
                status: 'fail',
                message: 'Access Restricted: Only students with a @iiit-bh.ac.in email account can sign up.'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if they don't exist
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-12), // Dummy password
            });
            sendWelcomeEmail(user.email, user.name);
        }

        createSendToken(user, 200, res);
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Google Token or server error'
        });
    }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get user by ID (Public info)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name profilePhoto');
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router;
