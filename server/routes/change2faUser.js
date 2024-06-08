const router = require('express').Router();
const { User } = require('../models/models');
const authenticateUser = require('../middlewares/Authenticate');
const Joi = require('joi');


router.post('/', authenticateUser, async (req, res) => {
    try {
        const userId = req.userId;
        
        const { error } = validation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.two_factor_enabled = req.body.two_factor_enabled;
        await user.save();

        res.status(200).json({ message: '2FA status was successfully changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  const validation = (data) => {
    const schema = Joi.object({
        two_factor_enabled: Joi.boolean()
    });
    return schema.validate(data);
}

module.exports = router;