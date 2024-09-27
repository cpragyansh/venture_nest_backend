const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "ecellcgc02@gmail.com",
        pass: "ewkoziwjsxwfuoeh"
    }
});

// Function to handle password reset email request
const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Your Email not Exist in Database' });
        }
        if (!user.AdminEmailVerification.verified) {
            return res.status(400).json({ message: `${user.Name} not Verified Please Contact to Admin` });
        }

        // Generate a password reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send the email
        const resetLink = `http://localhost:5000/admin/pwdchange/${token}`;
        const mailOptions = {
            to: user.email,
            from: "<ecellcgc02@gmail.com>",
            subject: 'Password Reset',
            text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to render the password change page
const renderPasswordChangePage = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });
        console.log(user);
        
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Render the password change page
        res.render('changePassword', {
            name: user.Name,
            email: user.email,
            role: user.Role,
            token: token
        });
    } catch (error) {
        console.error('Error rendering password change page:', error);
        res.status(500).send('Internal server error');
    }
};

// Function to handle password change submission
const changePassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(password, 10);
        user.pwd = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).send('Password changed successfully.');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    sendPasswordResetEmail,
    renderPasswordChangePage,
    changePassword
};
