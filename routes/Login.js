const express = require('express');
const router = express.Router();
const { LoginUser } = require('../controllers/authentication/Login');
const { refreshToken } = require('../controllers/authentication/RefreshToken');

// Refresh token route
router.post('/refresh-token', refreshToken);
router.post('/Login', LoginUser);

module.exports = router;
