const express = require('express');
const router = express.Router();
const { getVehicleDetails, addVehicle, getVehicles } = require('../controllers/vehicle');
const {auth, isAuthorize} = require('../middleware/auth');
const upload = require('../utils/cloudinary');

router.get('/',auth,getVehicles)
router.get('/:id', auth, getVehicleDetails);
router.post('/', auth, isAuthorize('admin'), upload.single('image'), addVehicle);

module.exports = router;
