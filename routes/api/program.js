const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Program = require('../../models/Programs');

const router = express.Router();

// Multer storage configuration for temporary uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Programphoto/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// ✅ Route to upload event data
router.post('/addProgram', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create and save new event
        const newProgram = new Program({
            programName: req.body.programName,
            programDate: req.body.programDate,
            programTitle: req.body.programTitle,
            programDescription: req.body.programDescription,
            imageUrl: result.secure_url
        });

        await newProgram.save();
        console.log(newProgram);
        res.status(201).json({ message: 'Program added successfully', newProgram });

    } catch (error) {
        console.error('Error adding Program:', error);
        res.status(500).json({ message: 'Error adding Program' });
    }
});

// ✅ Route to get all events
router.get('/programs', async (req, res) => {
    try {
        const programs = await Program.find({});
        res.status(200).json(programs);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Error fetching programs' });
    }
});

// ✅ Route to mark event as starred
router.post('/mark-starred', async (req, res) => {
    try {
        const { programId, isStarred } = req.body;
        const program = await Program.findById(programId);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        program.isStarred = isStarred;
        await program.save();

        res.status(200).json({ message: 'Program updated successfully', program });

    } catch (err) {
        console.error('Error updating program:', err);
        res.status(500).json({ message: 'Error updating program', error: err });
    }
});

// ✅ Route to get all starred events
router.get('/starred-programs', async (req, res) => {
    try {
        const programs = await Program.find({ isStarred: true });

        if (programs.length === 0) {
            return res.status(404).json({ message: 'No starred programs found' });
        }

        res.status(200).json(programs);
    } catch (err) {
        console.error('Error retrieving starred programs:', err);
        res.status(500).json({ message: 'Error retrieving programs', error: err });
    }
});

// ✅ Route to delete an event
router.delete('/deleteProgram/:id', async (req, res) => {
    try {
        console.log("Deleting program with ID:", req.params.id); // Debugging

        const { id } = req.params;
        const program = await Program.findById(id);

        if (!program) {
            console.log("Program not found");
            return res.status(404).json({ message: 'Program not found' });
        }

        // Extract the correct public_id from the Cloudinary URL
        const publicIdMatch = program.imageUrl.match(/\/v\d+\/(.+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            await cloudinary.uploader.destroy(publicIdMatch[1]);
        } else {
            console.warn("Cloudinary image ID extraction failed.");
        }

        // Delete event from MongoDB
        await Program.findByIdAndDelete(id);
        res.status(200).json({ message: 'Program deleted successfully' });

    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ message: 'Error deleting program' });
    }
});
// ✅ Route to update an event
router.put('/updateProgram/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Program updated successfully', updatedProgram });
    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ message: 'Error updating program' });
    }
});


module.exports = router;
