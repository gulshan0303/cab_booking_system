const Wallet = require('../models/wallet');
const User = require('../models/user');

const checkBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: 'Wallet not found' });
    res.json({ balance: wallet.balance });
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
    const userId = req.user.id || req.user; // Ensure we have the user ID from the request
    
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = new Wallet({ user: userId, balance: 0 });
    }
    wallet.balance += amount;
    await wallet.save();

    await User.findByIdAndUpdate(userId, { $inc: { walletBalance: amount } });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { checkBalance, addFunds };
