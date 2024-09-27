const OurPartners = require('../../models/OurPartners'); // Adjust the path
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Allowed categories
const allowedCategories = ['government', 'ecosystem', 'investor', 'mentor'];

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/OurPartners/'); // relative path for OurPartners uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Function to handle image and name upload for OurPartners and save to the database
const OurPartnersImgUpload = async (req, res) => {
    try {
        const { name, category } = req.body;

        // Validate if name, category, and image are provided
        if (!name || !category || !req.file) {
            return res.status(400).send('Name, Category, and Image are required.');
        }

        // Validate the category against allowed categories
        if (!allowedCategories.includes(category)) {
            return res.status(400).send(`Invalid category. Allowed categories are: ${allowedCategories.join(', ')}`);
        }

        // Create a new OurPartners document with the uploaded data
        const newPartner = new OurPartners({
            Name: name,
            imgpath: req.file.path, // Save the image path
            imgName: req.file.filename,
            Category: category // Save the category
        });

        // Save the new document to MongoDB
        await newPartner.save();

        console.log('New partner saved:', newPartner);
        res.status(200).send('Partner saved successfully!');
    } catch (err) {
        console.error('Error saving partner:', err);
        res.status(500).send('Error saving partner: ' + err);
    }
};

// Function to get an image by filename from the 'uploads' folder
const OurPartnersImgGet = (req, res) => {
    const filePath = path.join(__dirname, '../../uploads/OurPartners', req.params.filename); // Adjust path
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

// Function to get all OurPartners images and names from the database
const OurPartnersGetImg = async (req, res) => {
    try {
        // Fetch all OurPartners documents from the database
        const data = await OurPartners.find({});

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No partners found.' });
        }

        console.log(`Found ${data.length} partner entries.`);
        
        // Send the data as JSON response
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving partner images:', err);
        res.status(500).json({ message: 'Error retrieving partner images', error: err });
    }
};

module.exports = {
    OurPartnersImgUpload,
    OurPartnersImgGet,
    OurPartnersGetImg,
    upload // Export multer middleware for handling uploads
};
