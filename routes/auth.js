const express = require('express');
const router = express.Router();
const { signup, login, verifyOtp, updateRole } = require('../controllers/auth');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.put('/update-role', updateRole);

module.exports = router;
