const router = require('express').Router();
const Joi = require('joi');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const myCache = require('../services/cache');

router.post('/', async (req, res) => {
    try {
        const { error } = validation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});

        var secret = speakeasy.generateSecret({ name: req.body.user_id });

        QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
            if (err) return res.status(500).send({ message: 'Internal server error' });
            myCache.set(req.body.user_id, secret.base32, 600);
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