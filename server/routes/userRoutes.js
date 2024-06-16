const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateUser = require('../middlewares/Authenticate');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/user', authenticateUser, UserController.getUserPage);
router.post('/aiAnswer', authenticateUser, UserController.talkWithAI);

module.exports = router;