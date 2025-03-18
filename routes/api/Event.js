// /routes/eventRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Event = require('../../models/Event');
// Import the multer config

const router = express.Router();
// const upload = multer({ dest: 'uploads/Eventphoto/' }); // Temporary upload directory


// / Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Eventphoto/'); // Temporary upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage: storage }); // Create the multer instance
// Route to upload event data
router.post('/addEvent', upload.single('image'), async (req, res) => {
    try {

         // Check if the file was uploaded
         if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new Event document
        const newEvent = new Event({
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventTitle: req.body.eventTitle,
            imageUrl: result.secure_url // Store the Cloudinary URL
        });

        // Save the new event to MongoDB
        await newEvent.save();

        // Respond with success
        console.log(newEvent)
        res.status(201).json({ message: 'Event added successfully', newEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Error adding event' });
    }
});

// Route to get all events
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

router.post('/mark-starred' , async (req,res ) =>{

    try {
        const { eventId, isStarred } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update the isStarred field
        event.isStarred = isStarred;
        await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Error updating event', error: err });
    }
    
})

router.get('/starred-events', async (req,res) => {
    try {
        const events = await Event.find({ isStarred: true });

        if (events.length === 0) {
            return res.status(404).json({ message: 'No starred events found' });
        }

        res.status(200).json(events);
    } catch (err) {
        console.error('Error retrieving starred events:', err);
        res.status(500).json({ message: 'Error retrieving events', error: err });
    }
})



// Route to delete an event
router.delete('/deleteEvent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete the image from Cloudinary
        const imageUrl = event.imageUrl;
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(publicId);

        // Delete the event from MongoDB
        await Event.findByIdAndDelete(id);

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});




module.exports = router;
