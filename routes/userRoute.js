const express = require('express');
const { registerUser, login } = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', auth, login);


module.exports = router; 