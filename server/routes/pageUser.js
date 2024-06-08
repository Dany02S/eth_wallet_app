const router = require('express').Router();
const { User, Account, Transaction } = require('../models/models');
const authenticateUser = require('../middlewares/Authenticate');

router.get('/', authenticateUser, async (req, res) => {
    const userId = req.userId
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const accounts = await Account.find({ user_id: userId });
      transactions = await Transaction.find({ $or: [{ sender_address: { $in: accounts.map(account => account.address) } }, { receiver_address: { $in: accounts.map(account => account.address) } }] });
      const data = {
        user : {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          two_factor: user.two_factor_enabled
        },
        accounts: accounts,
        transactions : transactions
      };
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;