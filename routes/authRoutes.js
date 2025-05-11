const express = require('express');
const { signUp, verifyMail, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signUp);
router.post('/verify', verifyMail);
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router;