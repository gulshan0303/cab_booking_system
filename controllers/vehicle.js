const Vehicle = require('../models/vehicle');
const upload = require('../utils/cloudinary');
const Driver = require('../models/driver');
const ErrorHandler = require('../utils/ErrorHandler');


const addVehicle = async (req, res,next) => {
  try {
    const { 
      name, 
      cancellability, 
      waitingTime, 
      extraKilometerAmount, 
      reviews, 
      ratings, 
      driverId, 
      prices 
    } = req.body;

    const existingVehicle = await Vehicle.findOne({ name });
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle with the same name already exists' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return next(new ErrorHandler("Driver not found",404));
    }

    const imageUrl = req.file.path;

    const newVehicle = new Vehicle({
      name,
      cancellability,
      waitingTime,
      extraKilometerAmount,
      reviews,
      ratings,
      driver: driver._id,
      imageUrl,
      prices: {
        baseAmount: prices.baseAmount,
        perMinuteRate: prices.perMinuteRate,
        perKilometerRate: prices.perKilometerRate
      }
    });

    await newVehicle.save();
    res.status(201).json({success:true,message:"new vehicle added successfully",newVehicle});
  } catch (err) {
    return next(new ErrorHandler(err.message,500));
  }
};

const getVehicles = async(req,res,next) => {
   try {
      const vehicles = await Vehicle.find().sort({createAt:-1});
      const totalRecords = await Vehicle.find().countDocuments();
      res.status(200).json({success:true,message:"Vehicles list",totalRecords,vehicles});
   } catch (error) {
      return next(new ErrorHandler(error.message,500))
   }
}
const getVehicleDetails = async (req, res,next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('driver');
    if (!vehicle) return next(new ErrorHandler("Vehicle not found",404));
    res.status(200).json({success:true,message:"Vehicle details",vehicle});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getVehicleDetails, addVehicle,getVehicles };
