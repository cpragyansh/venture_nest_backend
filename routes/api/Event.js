const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Event = require('../../models/Event');

const router = express.Router();

// Multer storage configuration for temporary uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Eventphoto/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// ✅ Route to upload event data
router.post('/addEvent', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create and save new event
        const newEvent = new Event({
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventTitle: req.body.eventTitle,
            eventDescription: req.body.eventDescription,
            imageUrl: result.secure_url
        });

        await newEvent.save();
        console.log(newEvent);
        res.status(201).json({ message: 'Event added successfully', newEvent });

    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Error adding event' });
    }
});

// ✅ Route to get all events
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// ✅ Route to mark event as starred
router.post('/mark-starred', async (req, res) => {
    try {
        const { eventId, isStarred } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.isStarred = isStarred;
        await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });

    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Error updating event', error: err });
    }
});

// ✅ Route to get all starred events
router.get('/starred-events', async (req, res) => {
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
});

// ✅ Route to delete an event
router.delete('/deleteEvent/:id', async (req, res) => {
    try {
        console.log("Deleting event with ID:", req.params.id); // Debugging

        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            console.log("Event not found");
            return res.status(404).json({ message: 'Event not found' });
        }

        // Extract the correct public_id from the Cloudinary URL
        const publicIdMatch = event.imageUrl.match(/\/v\d+\/(.+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            await cloudinary.uploader.destroy(publicIdMatch[1]);
        } else {
            console.warn("Cloudinary image ID extraction failed.");
        }

        // Delete event from MongoDB
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });

    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;
