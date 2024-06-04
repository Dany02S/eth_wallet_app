const router = require('express').Router();
const { User, Account } = require('../models/models');
const bcrypt = require('bcrypt');
const e = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middlewares/Authenticate');

router.post('/', authenticateUser, async (req, res) => {
  try {
      const userId = req.userId

      const { error } = validation(req.body);
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
  });

  const validation = (data) => {
    const schema = Joi.object({
        name: Joi.string(),
        address: Joi.string(),
        password: Joi.string(),
    });
    return schema.validate(data);
}
  
  module.exports = router;