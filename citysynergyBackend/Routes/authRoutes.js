// backend/routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword } = require('../Controller/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;
