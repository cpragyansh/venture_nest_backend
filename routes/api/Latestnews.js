    // /routes/eventRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Latestnews = require('../../models/latestnews');
// Import the multer config

const router = express.Router();
// const upload = multer({ dest: 'uploads/Eventphoto/' }); // Temporary upload directory


// / Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/latestnews/'); // Temporary upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage: storage }); // Create the multer instance
// Route to upload event data
router.post('/addLatestNews', upload.single('image'), async (req, res) => {
    try {

         // Check if the file was uploaded
         if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new Event document
        const newLatestNews = new Latestnews({
            content: req.body.content,
            Title: req.body.Title,
            imageUrl: result.secure_url // Store the Cloudinary URL
        });

        // Save the new event to MongoDB
        await newLatestNews.save();

        // Respond with success
        console.log(newLatestNews)
        res.status(201).json({ message: 'Latest News added successfully', newLatestNews });
    } catch (error) {
        console.error('Error adding latest news:', error);
        res.status(500).json({ message: 'Error adding news' });
    }
});

// Route to get all events
router.get('/latestnews', async (req, res) => {
    try {
        const latestnews = await Latestnews.find({});
        res.status(200).json(latestnews);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

module.exports = router;