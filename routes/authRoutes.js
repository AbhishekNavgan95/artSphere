const express = require('express');
const { signUp, verifyMail, login, forgotPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signUp);
router.post('/verify', verifyMail);
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

module.exports = router;