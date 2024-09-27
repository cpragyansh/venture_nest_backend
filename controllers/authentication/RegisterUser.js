const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../../models/User'); // Adjust the path to your User model
const path = require('path');
const fs = require('fs')

// Registration function with ID card upload
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const idCardImage = req.file;
        console.log({ name, email, password, role });
        
        if (!idCardImage) {
            return res.status(400).send('ID Card image is required.');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const newUser = new User({
            Name: name,
            email: email,
            pwd: hashedPassword,
            idCard: {
                filename: idCardImage.filename,
                cardImgPath: idCardImage.path
            },
            Role: role,
            AdminEmailVerification: {
                token: verificationToken,
                tokenExpiration: tokenExpiration,
                verified: false
            }
        });

        await newUser.save();

        // Send email to admin for verification
        const adminEmail = process.env.ADMIN_EMAIL; 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "ecellcgc02@gmail.com",
                pass: "ewkoziwjsxwfuoeh"
            }
        });

        const verificationUrl = `http://localhost:5000/admin/verify-user/${verificationToken}`;

        const mailOptions = {
            from: '"E-Cell CGC" <ecellcgc02@gmail.com>',
            to: "shekharkashyap913@gmail.com",
            subject: 'New User Verification Request',
            html: `
                <p>A new user has registered. Please <a href="${verificationUrl}">click here</a> to verify or deny the user.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(201).send('User registered successfully. Admin verification required.');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
    }
};




const getIdCardImage = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/idcards', filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving file:', err);
                res.status(500).send('Error serving file');
            }
        });
    });
};

module.exports = {
    registerUser,
    getIdCardImage
};
