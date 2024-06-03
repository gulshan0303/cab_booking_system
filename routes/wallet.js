const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const { checkBalance, addFunds } = require('../controllers/wallet');

router.get('/balance', auth, checkBalance);
router.post('/add', auth, addFunds);

module.exports = router;
