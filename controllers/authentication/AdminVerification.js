const User = require('../../models/User');

// Function to render the verification page
const renderVerificationPage = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        "AdminEmailVerification.token": token,
        "AdminEmailVerification.tokenExpiration": { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Token is invalid or has expired.');
    }
    
    // Render the verification page using the EJS template
    res.render('emailVerification', {
        name: user.Name,
        email: user.email,
        role: user.Role,
        idCardPath: user.idCard.cardImgPath,
        token: token
        
    });
    console.log(idCardPath);
};

// Function to handle approval or denial
const handleVerificationAction = async (req, res) => {
    const { token } = req.params;
    const { action } = req.body;

    const user = await User.findOne({
        "AdminEmailVerification.token": token,
        "AdminEmailVerification.tokenExpiration": { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Invalid or expired token.');
    }

    if (action === 'approve') {
        user.AdminEmailVerification.verified = true;
        user.AdminEmailVerification.token = undefined;
        user.AdminEmailVerification.tokenExpiration = undefined;
        await user.save();
        return res.send('User approved successfully.');
    } else if (action === 'deny') {
        await User.findByIdAndDelete(user._id);
        return res.send('User denied and removed.');
    } else {
        return res.status(400).send('Invalid action.');
    }
};

module.exports = {
    renderVerificationPage,
    handleVerificationAction
};
