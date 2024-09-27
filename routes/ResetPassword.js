const express = require('express');
const router = express.Router();
const { sendPasswordResetEmail, renderPasswordChangePage, changePassword } = require('../controllers/authentication/ResetPassword');
const multer = require('multer');

// Route to request a password change
router.post('/reqpwdchange', sendPasswordResetEmail);

// Route to render the password change page
router.get('/pwdchange/:token', renderPasswordChangePage);

// Route to handle password change submission
router.post('/pwdchange/:token', changePassword);

module.exports = router;
