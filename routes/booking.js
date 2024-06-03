const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const { createBooking, getBookingHistory } = require('../controllers/booking');

router.post('/', auth, createBooking);
router.get('/history', auth, getBookingHistory);

module.exports = router;
