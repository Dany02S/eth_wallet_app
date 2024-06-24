const { User, Account, Transaction } = require('../models/models');
const bcrypt = require('bcrypt');
const { restoreAccountValidation, createAccountValidation, saveTransactionValidation } = require('../utils/validations');

exports.restoreAccount = async (req, res) => {
    try {
        const userId = req.userId
  
        const { error } = restoreAccountValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
  
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
  
        const validPassword = await bcrypt.compare(req.body.password, user.password_hashed);
        if (!validPassword) return res.status(404).send({ message: "Invalid password" });
  
        const account = await Account.findOne({ address: req.body.address });
        if (account) {
          account.user_id = userId;
          await account.save();
          return res.status(200).json({ 
              message: 'Address saved',
              address: account.address,
              name: account.name,
              user_id: account.user_id
           });
        } else {
          return res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.createAccount = async (req, res) => {
    try {
        const userId = req.userId
  
        const { error } = createAccountValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
  
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
  
        const account = await Account.findOne({ address: req.body.address });
        if (account) return res.status(400).json({ message: 'Address already exists' });
  
        const validPassword = await bcrypt.compare(req.body.password, user.password_hashed);
          if (!validPassword) return res.status(404).send({ message: "Invalid password" });
  
        const newAccount = new Account({
          user_id: userId,
          address: req.body.address,
          name: req.body.name
        });
        
        await newAccount.save();
        res.status(200).json({ message: 'Address saved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.saveTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        
        const { error } = saveTransactionValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const transaction = new Transaction({
            user_id: userId,
            transaction_hash: req.body.transaction_hash,
            amount: req.body.amount,
            sender_address: req.body.sender_address,
            receiver_address: req.body.receiver_address
        });

        await transaction.save();
        res.status(201).send({ message: 'Transaction was succesfully saved!'});
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
}

