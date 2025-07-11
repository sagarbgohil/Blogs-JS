const User = require('../models/User');
const { sendOtp } = require('../utils/otpUtils');

async function signup(req, res) {
    // Email signup logic
}

async function login(req, res) {
    // Email/pass login logic
}

async function verifyOtp(req, res) {
    // OTP verification logic
    await sendOtp(req.body.email);
    res.status(200).json({ message: "OTP sent to your email." });
}

module.exports = { signup, login, verifyOtp };
