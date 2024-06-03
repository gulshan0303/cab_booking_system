const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  role:{type:String,default:"user"},
  walletBalance: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
