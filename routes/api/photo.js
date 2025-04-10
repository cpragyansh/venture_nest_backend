// /routes/eventRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Photo = require('../../models/photo');
// Import the multer config

const router = express.Router();
// const upload = multer({ dest: 'uploads/Eventphoto/' }); // Temporary upload directory


// / Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/photo'); // Temporary upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage: storage }); // Create the multer instance
// Route to upload event data
router.post('/addPhoto', upload.single('image'), async (req, res) => {
    try {

         // Check if the file was uploaded
         if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new Event document
        const newPhoto = new Photo({
            photoName: req.body.photoName,
            imageUrl: result.secure_url // Store the Cloudinary URL
        });

        // Save the new event to MongoDB
        await newPhoto.save();

        // Respond with success
        console.log(newPhoto)
        res.status(201).json({ message: 'Photo added successfully', newPhoto });
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).json({ message: 'Error adding photo' });
    }
});

// Route to get all events
router.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find({});
        res.status(200).json(photos);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});
// UPDATE Photo
router.put('/photos/:id', upload.single('image'), async (req, res) => {
    try {
        const { photoName, photoDate } = req.body;
        let updatedData = { photoName, photoDate };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updatedData.imageUrl = result.secure_url;
        }

        const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json(updatedPhoto);
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ message: 'Error updating photo' });
    }
});

// DELETE Photo
router.delete('/photos/:id', async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        console.error("Error deleting photo:", error);
        res.status(500).json({ message: "Error deleting photo" });
    }
});


module.exports = router;
