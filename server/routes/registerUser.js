const router = require('express').Router();
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});

        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: 'User already exists'});
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        new_user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password_hashed: hashedPassword,
            two_factor_enabled: req.body.two_factor_enabled
        }
        const new_userm = await new User(new_user).save();
        const token = new_userm.generateAuthToken(new_userm._id);
        
        res.status(201).send({ message: 'User created, go create first address!', token: token });
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
});
const validation = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        two_factor_enabled: Joi.boolean()
    });
    return schema.validate(data);
}

module.exports = router;