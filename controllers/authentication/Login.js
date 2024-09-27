const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Load environment variables
require('dotenv').config();

// Function to handle user login
const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if(!user.AdminEmailVerification.verified){
            return res.status(401).json({ message: `${user.Name} are not Verified Please Contact To Admin` })
        }
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.pwd);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        console.log(isMatch);
        
        // Generate JWT access token and refresh token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Save refresh token in the database (optional, for invalidation)
        user.refreshToken = refreshToken;
        await user.save();

        // Send tokens to the client
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { LoginUser };
