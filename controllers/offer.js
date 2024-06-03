const Offer = require('../models/offer');
const Booking = require('../models/booking');
const ErrorHandler = require('../utils/ErrorHandler');


const makeDate = (date) => {
  let dateParts = date.split('-'); // DD-MM-YYYY
  return new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0], 0, 0, 0, 0));
};

const addOffer = async (req, res, next) => {
  const { code, discount, expirationDate } = req.body;
  
  // Use today's date if expirationDate is not provided
  const endDate = expirationDate ? expirationDate : moment().tz('Asia/Kolkata').format('DD-MM-YYYY');
  
  // Convert the endDate to a Date object with IST offset
  const end = makeDate(endDate);
  
  try {
    const newOffer = new Offer({ 
      code, 
      discount, 
      expirationDate: end 
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};
const getAllOffers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; // default limit to 10 documents per page

  try {
    const totalOffers = await Offer.countDocuments();
    const totalPages = Math.ceil(totalOffers / limit);

    const skip = (page - 1) * limit;

    const offers = await Offer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Coupon list",
      currentPage: page,
      totalPages: totalPages,
      totalOffers: totalOffers,
      offers: offers
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const applyOffer = async (req, res) => {
  const { bookingId, offerCode } = req.body;
  try {
    const offer = await Offer.findOne({ code: offerCode });
    if (!offer || new Date() > new Date(offer.expirationDate)) {
      return res.status(400).json({ msg: 'Invalid or expired offer code' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.Amount = booking.Amount - (booking.Amount * offer.discount) / 100;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addOffer, applyOffer,getAllOffers };
