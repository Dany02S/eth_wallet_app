const router = require('express').Router();
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const e = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const authenticateUser = require('../middlewares/Authenticate');

router.get('/', authenticateUser, async (req, res) => {
    const userId = req.userId
    console.log("hello");
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const data = {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

        res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;