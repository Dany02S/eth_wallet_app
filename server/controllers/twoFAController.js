const { User } = require('../models/models');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { qrValidation, verifyValidation, change2faValidation } = require('../utils/validations');

exports.getQrCode = async (req, res) => {
    try {
        const { error } = qrValidation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});
        
        const user = await User.findOne({ _id: req.body.user_id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        
        let url = '';
        if (user.two_factor_secret === '') {
            var secret = speakeasy.generateSecret({ name: `ETH Wallet - ${user.email}` }); // `ETH Wallet - ${user.email
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
}

exports.verifyUser = async (req, res) => {
    try {
        const { error } = verifyValidation(req.body); 
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
}

exports.change2faUser = async (req, res) => {
    try {
        const userId = req.userId;
        
        const { error } = change2faValidation(req.body);
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
}