const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const vehicleRoutes = require('./routes/vehicle');
const offerRoutes = require('./routes/offer');
const walletRoutes = require('./routes/wallet');
const paymentRoutes = require('./routes/payment');
const driverRoutes = require('./routes/driver')
const connectDB  = require('./db/connectDb');
const ErrorMiddleware = require("./middleware/error")
dotenv.config();

const app = express();
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/vehicle', vehicleRoutes);
app.use('/api/v1/coupon', offerRoutes);
app.use('/api/v1/driver', driverRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/payment', paymentRoutes);



//error middleware
app.use(ErrorMiddleware);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB()
  console.log(`Server running on port ${PORT}`);
});


