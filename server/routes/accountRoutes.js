const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');
const authenticateUser = require('../middlewares/Authenticate');

router.post('/restoreaccount', authenticateUser, AccountController.restoreAccount);
router.post('/account', authenticateUser, AccountController.createAccount);
router.post('/transaction', authenticateUser, AccountController.saveTransaction);

module.exports = router;