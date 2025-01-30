const { OTP } = require('../Models/OTP');

const verifyOTP = async (email, otp) => {
  const otpRecord = await OTP.findOne({
    where: { email },
    order: [['createdAt', 'DESC']]
  });

  if (!otpRecord) return false;
  if (otpRecord.otp !== otp) return false;
  
  // Check expiration (10 minutes)
  const createdAt = new Date(otpRecord.createdAt);
  const now = new Date();
  return (now - createdAt) < 600000; // 10 minutes in milliseconds
};

module.exports = verifyOTP;