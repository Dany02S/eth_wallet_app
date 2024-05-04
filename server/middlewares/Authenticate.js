const router = require('express').Router();
const { User } = require('../models/models');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }

    const [bearer, receivedToken] = token.split(' ');
    if (bearer !== 'Bearer' || !receivedToken) {
      return res.status(401).json({ message: 'Invalid authorization token format' });
    }

    try {
      const {_id} = jwt.verify(receivedToken, JWT_SECRET);
      req.userId = _id;
      next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
  };

module.exports = authenticateUser;