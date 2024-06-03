const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true },
  discount: { type: Number, required: true, min: 0 },
  expirationDate: { type: Date, required: true },
},{timestamps:true});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;