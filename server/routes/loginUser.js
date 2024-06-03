const router = require('express').Router();
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message});

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: "User not found"});

        const validPassword = await bcrypt.compare(req.body.password, user.password_hashed);
        if (!validPassword) return res.status(404).send({ message: "Invalid password" });

        if (user.two_factor_enabled) {
            return res.status(200).send({ user_id: user._id, message: "Login successful, redirectiong to the 2FA" });
        } else {
            const token = user.generateAuthToken(user._id);
            return res.status(200).send({ token: token, user_id: user._id, message: "Login successful" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});
const validation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}

module.exports = router;