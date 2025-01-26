// backend/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const User = sequelize.define('User', {
    uuid: {
        type: DataTypes.STRING,

    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'email',
    
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = User;
