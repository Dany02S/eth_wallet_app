const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const speakeasy = require('speakeasy');
const myCache = require('../services/cache');
const { User } = require('../models/models');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});

        const user = await User.findOne({ _id: req.body.user_id });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: req.body.verification_code
        });
        if (!verified) return res.status(404).send({ message: 'Invalid verification code' });

        const token = user.generateAuthToken(user._id);
        res.status(201).send({ message: 'User verified!', token: token });
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
});
const validation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        verification_code: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports = router;