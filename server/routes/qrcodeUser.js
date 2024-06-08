const router = require('express').Router();
const Joi = require('joi');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const myCache = require('../services/cache');
const { User } = require('../models/models');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});
        
        const user = await User.findOne({ _id: req.body.user_id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        
        let url = '';
        if (user.two_factor_secret === '') {
            var secret = speakeasy.generateSecret({ name: req.body.user_id });
            user.two_factor_secret = secret.base32;
            url = secret.otpauth_url;
            await user.save();
        } else {
            var secret = user.two_factor_secret;
            url = speakeasy.otpauthURL({ secret: secret, label: req.body.user_id, encoding: 'base32' });
        }

        QRCode.toDataURL(url, function(err, data_url) {
            if (err) return res.status(500).send({ message: 'Internal server error' });

            res.send({ 
                message: 'QR code generated',
                data_url: data_url,
            });
        });
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
});
const validation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports = router;