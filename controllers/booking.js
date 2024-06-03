const Booking = require("../models/booking");
const Vehicle = require("../models/vehicle");
const ErrorHandler = require("../utils/ErrorHandler");
const Coupon = require("../models/offer");
const moment = require("moment");
const User = require("../models/user");
const createBooking = async (req, res, next) => {
  const { vehicleId, pickupLocation, dropLocation, Amount, couponCode } =
    req.body;
  try {
    let couponAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        const currentDate = new Date();
        const expirationDate = moment(coupon.expirationDate).toDate();
        if (expirationDate > currentDate) {
          couponAmount = coupon.discount;
        } else {
          return next(new ErrorHandler("Coupon is invalid or expired", 400));
        }
      } else {
        return next(new ErrorHandler("Coupon not found", 400));
      }
    }
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return next(new ErrorHandler("Vehicle not found", 404));
    }

    const user = await User.findById({ _id: req.user.id });

    const finalAmount = Amount - couponAmount;
    const userWallet = user?.walletBalance;
    if (userWallet < finalAmount) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in the wallet" });
    }

    user.walletBalance -= finalAmount;
    await user.save();
    const newBooking = new Booking({
      user: user,
      vehicle,
      pickupLocation,
      dropLocation,
      Amount: finalAmount,
      couponApplied: couponCode ? true : false,
      couponAmount,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ success: true, message: "Booking created!", newBooking });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "vehicle"
    );
    res
      .status(200)
      .json({ success: true, message: "Booking Records", bookings });
  } catch (err) {
    return next(new ErrorHandler(err.message));
  }
};

module.exports = { createBooking, getBookingHistory };
