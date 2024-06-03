const Booking = require('../models/booking');
// const Payment = require('../models/payment');
const Offer = require('../models/offer');
const User = require('../models/user');

const processPayment = async (req, res) => {
  const { bookingId, paymentMethod, couponCode } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate('vehicle');
    const user = await User.findById(req.user);

    if (!booking || !user) {
      return res.status(404).json({ error: 'Booking or user not found' });
    }

    let couponDiscount = 0;
    let offer = null;

    // Check if coupon code is provided
    if (couponCode) {
      offer = await Offer.findOne({ code: couponCode, expirationDate: { $gt: Date.now() } });

      if (offer) {
        couponDiscount = (booking.Amount * offer.discount) / 100;
      }
    }

    const payableAmount = booking.Amount - couponDiscount;

    // Check if user has enough balance in their wallet
    if (paymentMethod === 'wallet' && user.wallet < payableAmount) {
      return res.status(400).json({ error: 'Insufficient balance in your wallet. Please add funds.' });
    }

    // Create a new payment record
    const payment = new Payment({
      booking: bookingId,
      user: req.user,
      amount: payableAmount,
      paymentMethod,
      couponApplied: offer ? offer._id : null,
      couponDiscount,
    });

    await payment.save();

    // Update user's wallet balance if payment method is 'wallet'
    if (paymentMethod === 'wallet') {
      user.wallet -= payableAmount;
      await user.save();
    }

    // Update booking status
    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { processPayment };
