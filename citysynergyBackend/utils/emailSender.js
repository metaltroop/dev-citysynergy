const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const OTP  = require('../Models/OTP'); // Import from Models index

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Send OTP Email
const sendOTPEmail = async (email) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP in the database
    await OTP.create({ email, otp, expiresAt });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'City Synergy Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Verification Code</h2>
          <p style="font-size: 16px;">Use this code to complete your registration/login:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 3px; color: #1e40af;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This code expires in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const otpRecord = await OTP.findOne({
      where: { email, otp },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) return false; // OTP not found

    if (new Date() > otpRecord.expiresAt) {
      await OTP.destroy({ where: { email, otp } }); // Remove expired OTP
      return false; // Expired OTP
    }

    return true; // OTP is valid
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail, verifyOTP };
