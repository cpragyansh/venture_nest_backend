const CouncilMembers = require('../../models/CouncilMemberss');
const cloudinary = require('../../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Allowed categories for council members
const allowedCouncilCategories = ['advisory', 'techinnov', 'mentorship', 'legalcompl','investFund'];

// Multer config (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'CouncilMembers' },
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

// Upload new council member
const uploadCouncilMember = async (req, res) => {
    try {
        let { name, company, category } = req.body;

        // Convert name & company to string if they're arrays
        if (Array.isArray(name)) name = name.join(", ");
        if (Array.isArray(company)) company = company.join(", ");

        // Validate inputs
        if (!name || !company || !category || !req.file) {
            return res.status(400).json({ message: 'Name, Company, Category, and Image are required.' });
        }

        // Validate category
        if (!allowedCouncilCategories.includes(category.toLowerCase())) {
            return res.status(400).json({ message: `Invalid category. Allowed categories: ${allowedCouncilCategories.join(', ')}` });
        }

        // Upload image to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        // Save to MongoDB
        const newMember = new CouncilMembers({
            name,
            company,
            category,
            imgpath: cloudinaryResult.secure_url,
            imgName: cloudinaryResult.public_id
        });

        await newMember.save();
        res.status(200).json({ message: 'Council Member saved successfully!', member: newMember });

    } catch (err) {
        console.error('Error saving council member:', err);
        res.status(500).json({ message: 'Error saving council member', error: err.message });
    }
};

// Get council members by category
const getCouncilMembers = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category: category.toLowerCase() } : {};

        const members = await CouncilMembers.find(filter);
        if (!members.length) {
            return res.status(404).json({ message: 'No council members found.' });
        }

        res.status(200).json(members);
    } catch (err) {
        console.error('Error retrieving council members:', err);
        res.status(500).json({ message: 'Error retrieving council members', error: err.message });
    }
};

module.exports = {
    uploadCouncilMember,
    getCouncilMembers,
    upload
};
