const OurPartners = require('../../models/OurPartners'); // Adjust the path
const cloudinary = require('../../config/cloudinary'); // Cloudinary config
const multer = require('multer');
const streamifier = require('streamifier');

// ✅ Add new category 'accelerator'
const allowedCategories = ['government', 'ecosystem', 'investor', 'mentor', 'accelerator'];

// Multer configuration (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Function to upload image to Cloudinary and return the secure URL
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'OurPartners' }, // Save in Cloudinary folder
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

// Function to handle partner image upload and save it to MongoDB
const OurPartnersImgUpload = async (req, res) => {
    try {
        let { name, category } = req.body;

        // ✅ Convert name to string if it's an array
        if (Array.isArray(name)) {
            name = name.join(", "); // Convert array to comma-separated string
        }

        // Validate required fields
        if (!name || !category || !req.file) {
            return res.status(400).json({ message: 'Name, Category, and Image are required.' });
        }

        // Validate category
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ message: `Invalid category. Allowed categories are: ${allowedCategories.join(', ')}` });
        }

        // Upload image to Cloudinary and get the URL
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        // Save the Cloudinary image URL to MongoDB
        const newPartner = new OurPartners({
            Name: name,  // ✅ Now always a string
            imgpath: cloudinaryResult.secure_url, // Save Cloudinary URL
            imgName: cloudinaryResult.public_id, // Save Cloudinary public ID
            Category: category
        });

        await newPartner.save();
        console.log('New partner saved:', newPartner);

        res.status(200).json({
            message: 'Partner saved successfully!',
            partner: newPartner
        });
    } catch (err) {
        console.error('Error saving partner:', err);
        res.status(500).json({ message: 'Error saving partner', error: err.message });
    }
};


// Function to get all partners (with optional category filter)
const OurPartnersGetImg = async (req, res) => {
    try {
        const { category } = req.query; // Get category from query
        const filter = category ? { Category: category } : {};

        const data = await OurPartners.find(filter);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No partners found.' });
        }

        console.log(`Found ${data.length} partner entries.`);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving partners:', err);
        res.status(500).json({ message: 'Error retrieving partners', error: err.message });
    }
};

module.exports = {
    OurPartnersImgUpload,
    OurPartnersGetImg,
    upload // Export multer instance for file uploads
};
