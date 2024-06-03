const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const { processPayment } = require('../controllers/payment');

// router.post('/', auth, processPayment);

module.exports = router;
