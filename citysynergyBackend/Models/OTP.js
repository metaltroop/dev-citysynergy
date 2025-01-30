// citysynergyBackend/Models/OTP.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [{
    fields: ['email'],
    unique: false
  }]
});

module.exports = OTP;
