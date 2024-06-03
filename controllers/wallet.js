const Wallet = require('../models/wallet');
const User = require('../models/user');
const ErrorHandler = require('../utils/ErrorHandler');

const checkBalance = async (req, res,next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return next(new ErrorHandler("Wallet not found",404))
    res.status(200).json({success:true,message:"Wallet Details", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFunds = async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  try {
    const userId = req.user.id || req.user;
    
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = new Wallet({ user: userId, balance: 0 });
    }
    wallet.balance += amount;
    await wallet.save();

    await User.findByIdAndUpdate(userId, { $inc: { walletBalance: amount } });

    res.status(200).json({success:true,message:"Balance added successfully",wallet});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { checkBalance, addFunds };
