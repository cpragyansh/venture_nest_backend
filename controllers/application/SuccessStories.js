const SuccessStories = require('../../models/SuccessStories'); // Correct model path
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../../config/cloudinary')

// Multer storage configuration for founder image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/SuccessStories/'); // Ensure proper directory structure
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Function to handle image, name, and description upload for SuccessStories
const FounderDetUpload = async (req, res) => {
    try {
        // Check if required fields are provided
        if (!req.body.StartupName || !req.body.StartupAbout || !req.file) {
            return res.status(400).send('Startup Name, About, and Founder Image are all required.');
        }
const result = await cloudinary.uploader.upload(req.file.path)

        // Create a new SuccessStories document with the uploaded data
        const newStory = new SuccessStories({
            StartupName: req.body.StartupName,
            StartupAbout: req.body.StartupAbout,
            FounderImg: result.secure_url, // Save the image path
            FounderImgName: req.file.filename
             // Save the image filename
        });

        // Save the new document to MongoDB
        await newStory.save();

        console.log('New success story saved:', newStory);
        res.status(200).send('Success Story saved successfully!');
    } catch (err) {
        console.error('Error saving success story:', err);
        res.status(500).send('Error saving success story: ' + err);
    }
};

// Function to get an image by filename from the 'uploads' folder
const FounderImgGetfromserver = (req, res) => {
    const filePath = path.join(__dirname, '../../uploads/SuccessStories', req.params.filename); // Adjust path
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'image/jpeg'; // Default to jpeg

        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg') contentType = 'image/jpg';

        res.setHeader('Content-Type', contentType);
        fs.createReadStream(filePath).pipe(res); // Stream the image
    });
};

// Function to get all SuccessStories images and details from the database
const FounderImgGet = async (req, res) => {
    try {
        // Fetch all SuccessStories documents from the database
        const data = await SuccessStories.find({});

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No success stories found.' });
        }

        console.log(`Found ${data.length} success stories entries.`);
        
        // Send the data as JSON response
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving success stories:', err);
        res.status(500).json({ message: 'Error retrieving success stories', error: err });
    }
};

module.exports = {
    FounderDetUpload,
    FounderImgGet,
    FounderImgGetfromserver,
    upload // Export multer middleware for handling uploads
};
