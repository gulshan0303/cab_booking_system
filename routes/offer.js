const express = require('express');
const router = express.Router();
const {auth,isAuthorize} = require('../middleware/auth');
const { addOffer, applyOffer, getAllOffers } = require('../controllers/offer');

router.get('/', auth, getAllOffers);
router.post('/add', auth,isAuthorize('admin'), addOffer);
router.post('/apply', auth, applyOffer);

module.exports = router;
