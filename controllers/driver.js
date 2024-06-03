const Driver = require('../models/driver');
const ErrorHandler = require('../utils/ErrorHandler'); // Adjust the path to your ErrorHandler

// Add a new driver
const addDriver = async (req, res, next) => {
  try {
    const { name, licenseNumber, phone, address } = req.body;

    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return next(new ErrorHandler('Driver with the same license number already exists', 400));
    }

    const newDriver = new Driver({ name, licenseNumber, phone, address });
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

// Get the list of drivers
const getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    const totalRecords = await Driver.countDocuments();
    res.status(200).json({ success: true, message: "Driver list", totalRecords, drivers });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

// Get the list of drivers
const getDriver = async (req, res, next) => {
  const {id} = req.params
  try {
    const driver = await Driver.findById(id)
    const totalRecords = await Driver.countDocuments();
    res.status(200).json({ success: true, message: "Driver Details", driver });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};
// Update an existing driver
const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, licenseNumber, phone, address } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { name, licenseNumber, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      return next(new ErrorHandler('Driver not found', 404));
    }

    res.json(updatedDriver);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

// Delete an existing driver
const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) {
      return next(new ErrorHandler('Driver not found', 404));
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

module.exports = { addDriver, updateDriver, deleteDriver, getDrivers ,getDriver};
