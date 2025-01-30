// backend/routes/authRoutes.js
const express = require('express');
const { initiateRegistration, completeRegistration, initiateLogin, completeLogin } = require('../Controller/authController');
const router = express.Router();

router.post('/register/initiate', initiateRegistration);
router.post('/register/complete', completeRegistration);
router.post('/login/initiate', initiateLogin);
router.post('/login/complete', completeLogin);

module.exports = router;
