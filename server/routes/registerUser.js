const router = require('express').Router();
const { User } = require('../models/models');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send('User already registered');
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        new_user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password_hashed: hashedPassword
        }
        await new User(new_user).save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});
const validation = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports = router;