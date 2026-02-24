const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@iiit-bh\.ac\.in$/, 'Please use your college email (@iiit-bh.ac.in)']
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will be deleted after 5 minutes (300 seconds)
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
