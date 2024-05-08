const router = require('express').Router();
const { Transaction } = require('../models/models');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const authenticateUser = require('../middlewares/Authenticate');

router.post('/', authenticateUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { error } = validation(req.body);
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
});

const validation = (data) => {
    const schema = Joi.object({
        transaction_hash: Joi.string().min(64).max(64).required(),
        amount: Joi.number().required(),
        sender_address: Joi.string().min(42).max(42).required(),
        receiver_address: Joi.string().min(42).max(42).required()
    });
    return schema.validate(data);
}

module.exports = router;