const router = require('express').Router();
const { User, Address } = require('../models/models');
const bcrypt = require('bcrypt');
const e = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const authenticateUser = require('../middlewares/Authenticate');

router.post('/', authenticateUser, async (req, res) => {
    const userId = req.userId
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Save the address to the database
      const newAddress = new Address({
        user_id: userId,
        address: req.body.address,
        name: "Valami cím"
      });
      await newAddress.save();
      res.status(200).json({ message: 'Address saved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;