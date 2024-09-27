const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure unique email addresses
    },
    pwd: {
        type: String,
        required: true
    },
    idCard: {
        filename: {
            type: String,
            required: true
        },
        cardImgPath: {
            type: String,
            required: true
        }
    },
    Role: {
        type: String,
        required: true
    },
    AdminEmailVerification: {
        verified: {
            type: Boolean,
            default: false
        },
        token: {
            type: String
        },
        tokenExpiration: {
            type: Date
        }
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
