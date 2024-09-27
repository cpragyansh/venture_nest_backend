const express = require('express');
const router = express.Router();
const { renderVerificationPage, handleVerificationAction } = require('../controllers/authentication/AdminVerification');

// Route to render the verification page
router.get('/verify-user/:token', renderVerificationPage);

// Route to handle approval or denial
router.post('/verify-user/:token/action', handleVerificationAction);

module.exports = router;
