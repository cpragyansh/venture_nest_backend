const HeroSection = require('../../models/HeroSection'); // Adjust the path
const multer = require('multer');
const path = require('path');
const cloudinary = require('../../config/cloudinary'); // Cloudinary configuration

// Multer storage configuration (if needed for temp storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/HeroSection/'); // local storage before uploading to Cloudinary (optional)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Function to handle image upload and save URLs from Cloudinary to the database
const HeroSectionImgUpload = async (req, res) => {
    try {
        // Check if any file was uploaded
        if (!req.files.mobile && !req.files.tablet && !req.files.laptop && !req.files.desktop) {
            return res.status(400).send('At least one device image must be uploaded.');
        }

        // Get the latest HeroSection document or create a new one if it doesn't exist
        let heroSection = await HeroSection.findOne().sort({ _id: -1 });
        if (!heroSection) {
            heroSection = new HeroSection();
        }

        // Helper function to upload files to Cloudinary
        const uploadToCloudinary = async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'HeroSection'
            });
            return result.secure_url; // Return the Cloudinary URL
        };

        // Process mobile images
        if (req.files.mobile) {
            for (const file of req.files.mobile) {
                const url = await uploadToCloudinary(file); // Upload to Cloudinary
                heroSection.mobile.push({
                    filename: file.filename,
                    path: url, // Save the Cloudinary URL
                });
            }
        }

        // Process tablet images
        if (req.files.tablet) {
            for (const file of req.files.tablet) {
                const url = await uploadToCloudinary(file); // Upload to Cloudinary
                heroSection.tablet.push({
                    filename: file.filename,
                    path: url, // Save the Cloudinary URL
                });
            }
        }

        // Process laptop images
        if (req.files.laptop) {
            for (const file of req.files.laptop) {
                const url = await uploadToCloudinary(file); // Upload to Cloudinary
                heroSection.laptop.push({
                    filename: file.filename,
                    path: url, // Save the Cloudinary URL
                });
            }
        }

        // Process desktop images
        if (req.files.desktop) {
            for (const file of req.files.desktop) {
                const url = await uploadToCloudinary(file); // Upload to Cloudinary
                heroSection.desktop.push({
                    filename: file.filename,
                    path: url, // Save the Cloudinary URL
                });
            }
        }

        // Save the updated document to MongoDB
        await heroSection.save();

        // Respond with the saved URLs
        const response = {
            message: 'Images uploaded and saved successfully!',
            mobile: heroSection.mobile,
            tablet: heroSection.tablet,
            laptop: heroSection.laptop,
            desktop: heroSection.desktop,
        };

        res.status(200).json(response);

    } catch (err) {
        console.error('Error saving images:', err);
        res.status(500).send('Error saving images: ' + err.message);
    }
};

// Function to get the latest HeroSection images from the database
const HeroSectionGetImg = async (req, res) => {
    try {
        // Use projection to return only relevant fields if needed (e.g., specific fields only)
        const data = await HeroSection.find({}, { mobile: 1, tablet: 1, laptop: 1, desktop: 1 });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No images found.' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving HeroSection images:', err);
        res.status(500).json({ message: 'Error retrieving HeroSection images', error: err });
    }
};

module.exports = {
    HeroSectionImgUpload,
    HeroSectionGetImg,
    upload // Export the multer upload middleware to be used in the router
};
