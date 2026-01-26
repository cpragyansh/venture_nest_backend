const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Event = require('../../models/Event');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer storage configuration for temporary uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Eventphoto/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Configure multer to accept both single main image and multiple event images
// Supports multiple field name variations for flexibility
const upload = multer({ storage: storage }).fields([
    { name: 'imageUrl', maxCount: 1 },      // Main event image (preferred)
    { name: 'image', maxCount: 1 },         // Alternative field name for main image
    { name: 'EventImages', maxCount: 6 },   // Additional event images (preferred)
    { name: 'images', maxCount: 6 }         // Alternative field name for gallery images
]);

// ✅ Route to upload event data with multiple images
router.post('/addEvent', upload, async (req, res) => {
    try {
        console.log('📥 Received files:', req.files);
        console.log('📝 Received body:', req.body);

        // Check for main image (support both 'imageUrl' and 'image' field names)
        const mainImageFile = req.files?.imageUrl?.[0] || req.files?.image?.[0];

        if (!mainImageFile) {
            return res.status(400).json({
                message: 'Main image is required',
                receivedFields: req.files ? Object.keys(req.files) : [],
                hint: 'Send main image as "imageUrl" or "image" field'
            });
        }

        // Upload main image to Cloudinary
        const mainImageResult = await cloudinary.uploader.upload(mainImageFile.path);

        // Upload additional event images (support both 'EventImages' and 'images' field names)
        let eventImageUrls = [];
        const galleryFiles = req.files?.EventImages || req.files?.images || [];

        if (galleryFiles.length > 0) {
            const eventImageUploadPromises = galleryFiles.map(file =>
                cloudinary.uploader.upload(file.path)
            );
            const eventImageResults = await Promise.all(eventImageUploadPromises);
            eventImageUrls = eventImageResults.map(result => result.secure_url);
        }

        // Create and save new event
        const newEvent = new Event({
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventTitle: req.body.eventTitle,
            eventDescription: req.body.eventDescription,
            imageUrl: mainImageResult.secure_url,
            EventImages: eventImageUrls
        });

        await newEvent.save();
        console.log('✅ Event created:', newEvent);
        res.status(201).json({ message: 'Event added successfully', newEvent });

    } catch (error) {
        console.error('❌ Error adding event:', error);
        res.status(500).json({
            message: 'Error adding event',
            error: error.message
        });
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

        // Delete main image from Cloudinary
        const publicIdMatch = event.imageUrl.match(/\/v\d+\/(.+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            await cloudinary.uploader.destroy(publicIdMatch[1]);
        } else {
            console.warn("Cloudinary main image ID extraction failed.");
        }

        // Delete all EventImages from Cloudinary
        if (event.EventImages && event.EventImages.length > 0) {
            const deletePromises = event.EventImages.map(imageUrl => {
                const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\./);
                if (publicIdMatch && publicIdMatch[1]) {
                    return cloudinary.uploader.destroy(publicIdMatch[1]);
                } else {
                    console.warn("Cloudinary event image ID extraction failed for:", imageUrl);
                    return Promise.resolve();
                }
            });
            await Promise.all(deletePromises);
        }

        // Delete event from MongoDB
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });

    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});
// ✅ Route to update an event (supports text, image replacement, adding/removing images)
router.put('/updateEvent/:id', upload, async (req, res) => {
    try {
        const { id } = req.params;
        let event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 1. Handle Text Updates
        // Update basic fields if they exist in req.body
        const updateFields = ['eventName', 'eventDate', 'eventTitle', 'eventDescription', 'isStarred', 'order'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        // 2. Handle Main Image Update (Replace)
        // Checks for 'imageUrl' or 'image' field
        const mainImageFile = req.files?.imageUrl?.[0] || req.files?.image?.[0];
        if (mainImageFile) {
            // Delete old main image from Cloudinary
            if (event.imageUrl) {
                const oldPublicId = event.imageUrl.match(/\/v\d+\/(.+)\./)?.[1];
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId);
                }
            }

            // Upload new main image
            const result = await cloudinary.uploader.upload(mainImageFile.path);
            event.imageUrl = result.secure_url;
        }

        // 3. Handle Gallery Images (Append new ones)
        // Checks for 'EventImages' or 'images' fields
        const galleryFiles = req.files?.EventImages || req.files?.images || [];
        if (galleryFiles.length > 0) {
            const uploadPromises = galleryFiles.map(file => cloudinary.uploader.upload(file.path));
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(r => r.secure_url);

            // Initialize array if it doesn't exist
            if (!event.EventImages) event.EventImages = [];
            event.EventImages.push(...newUrls);
        }

        // 4. Handle Deleting Specific Gallery Images
        // Expecting 'deletedEventImages' in body (can be JSON string or single URL string/array)
        if (req.body.deletedEventImages) {
            let imagesToDelete = req.body.deletedEventImages;

            // Parse if it's a JSON string
            if (typeof imagesToDelete === 'string') {
                try {
                    // Try parsing as JSON array
                    if (imagesToDelete.startsWith('[')) {
                        imagesToDelete = JSON.parse(imagesToDelete);
                    } else {
                        // Treat as single URL string
                        imagesToDelete = [imagesToDelete];
                    }
                } catch (e) {
                    // Fallback: treat as single item array
                    imagesToDelete = [imagesToDelete];
                }
            }

            // Ensure it is an array before processing
            if (Array.isArray(imagesToDelete)) {
                // Remove from Cloudinary
                const deletePromises = imagesToDelete.map(url => {
                    const publicIdMatch = url.match(/\/v\d+\/(.+)\./);
                    if (publicIdMatch && publicIdMatch[1]) {
                        return cloudinary.uploader.destroy(publicIdMatch[1]);
                    }
                    return Promise.resolve();
                });
                await Promise.all(deletePromises);

                // Remove from DB (filter out deleted URLs)
                event.EventImages = event.EventImages.filter(url => !imagesToDelete.includes(url));
            }
        }

        await event.save();
        console.log('✅ Event updated:', event._id);
        res.status(200).json({ message: 'Event updated successfully', updatedEvent: event });

    } catch (error) {
        console.error('❌ Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
});


module.exports = router;
