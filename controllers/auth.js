const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendOtp = require('../utils/sendOtp');
const ErrorHandler = require('../utils/ErrorHandler');
dotenv.config();


const signup = async (req, res,next) => {
    const { phoneNumber, password } = req.body;
    try {
      let user = await User.findOne({ phoneNumber });
      if (user)  return next(new ErrorHandler("User already exists",400));

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await sendOtp(phoneNumber, otp);
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ phoneNumber, password: hashedPassword, otp });
      await user.save();
      res.status(201).json({success:true, msg: `OTP sent to your phone number:${phoneNumber}.` });
    } catch (err) {
      return next(new ErrorHandler(err.message))
    }
  };
  
const verifyOtp = async (req, res,next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber, otp });
    if (!user) return next(new ErrorHandler("Invalid OTP",400))

    user.otp = null;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await user.save();
    res.status(200).json({success:true, msg: 'OTP verified successfully',user,token });
  } catch (err) {
   return next(new ErrorHandler(err.message,500))
  }
};

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return next(new ErrorHandler("User does not exist", 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid credentials", 400));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtp(phoneNumber, otp);

    // Store OTP in the user document or a temporary collection
    user.otp = otp;
    await user.save();

    res.status(200).json({ success: true, message: `OTP sent to your phone number: ${phoneNumber}. Please verify to complete login.` });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

const updateRole = async (req, res, next) => {
  const { userId, newRole } = req.body;
  
  try {
    let user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    user.role = newRole;
    await user.save();
    
    res.status(200).json({ success: true, msg: 'User role updated successfully', user });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

module.exports = { signup, login ,verifyOtp,updateRole};
