const express = require('express');
const router = express.Router();
const TwoFAController = require('../controllers/TwoFAController');
const authenticateUser = require('../middlewares/Authenticate');

router.post('/change2fa', authenticateUser, TwoFAController.change2faUser);
router.post('/verify', TwoFAController.verifyUser);
router.post('/qrcode', TwoFAController.getQrCode);

module.exports = router;