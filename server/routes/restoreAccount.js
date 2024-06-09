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
  });

  const validation = (data) => {
    const schema = Joi.object({
        password: Joi.string(),
        address: Joi.string(),
    });
    return schema.validate(data);
}
  
  module.exports = router;