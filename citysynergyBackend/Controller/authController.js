// backend/Controller/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/User');
const OTP = require('../Models/OTP');
const { sendOTPEmail, verifyOTP } = require('../utils/emailSender');
require('dotenv').config();


// Initiate Registration
exports.initiateRegistration = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Generate and send OTP
    await sendOTPEmail(email);

    res.status(200).json({
      message: 'OTP sent successfully',
      nextStep: '/verify-otp',
    });
  } catch (error) {
    console.error('Registration initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate registration' });
  }
};

// Complete Registration
exports.completeRegistration = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    if (!(await verifyOTP(email, otp))) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    await OTP.destroy({ where: { email } }); // Cleanup OTP after success

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration completion error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Initiate Login
exports.initiateLogin = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email not registered' });
    }

    await sendOTPEmail(email);

    res.status(200).json({
      message: 'OTP sent to registered email',
      nextStep: '/verify-otp',
    });
  } catch (error) {
    console.error('Login initiation error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Complete Login
exports.completeLogin = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!(await verifyOTP(email, otp))) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await OTP.destroy({ where: { email } });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login completion error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
