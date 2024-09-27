const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser ,getIdCardImage} = require('../controllers/authentication/RegisterUser');

// Multer configuration for ID card upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/idcards');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Register user route
router.post('/register', upload.single('idCardImage'), registerUser);

router.get('/uploads/idcards/:filename', getIdCardImage);


module.exports = router;
