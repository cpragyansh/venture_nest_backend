const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Load environment variables
require('dotenv').config();

// Function to handle token refresh
const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        
        // Find the user by ID
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Send the new access token to the client
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { refreshToken };
