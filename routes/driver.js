const express = require('express');
const router = express.Router();
const { addDriver, updateDriver, deleteDriver, getDrivers, getDriver } = require('../controllers/driver');
const {auth, isAuthorize} = require('../middleware/auth'); // Assuming auth middleware is used

router.get('/',auth,isAuthorize('admin'),getDrivers)
router.get('/:id',auth,isAuthorize('admin'),getDriver)
router.post('/', auth,isAuthorize('admin'), addDriver);
router.put('/:id', auth,isAuthorize('admin'), updateDriver);
router.delete('/:id', auth,isAuthorize('admin'), deleteDriver);

module.exports = router;
