const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
},{timestamps:true});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
