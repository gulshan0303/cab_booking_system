const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: String,
  cancellability: Boolean,
  waitingTime: Number,
  extraKilometerAmount: Number,
  reviews: [String],
  ratings: Number,
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  imageUrl: String,
  prices: { 
    baseAmount: { type: Number, required: true },
    perMinuteRate: { type: Number, required: true },
    perKilometerRate: { type: Number, required: true }
  }
},{timestamps:true});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
