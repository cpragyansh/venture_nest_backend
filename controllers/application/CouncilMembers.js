const CouncilMembers = require('../../models/CouncilMemberss');
const cloudinary = require('../../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Allowed categories for council members
// const allowedCouncilCategories = ['advisory', 'techinnov', 'mentorship', 'legalcompl'];
// Allowed categories for council members
const allowedCouncilCategories = ['advisory', 'techinnov', 'mentorship', 'legalcompl', 'investFund'];


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

// Upload new council member (CREATE)
const uploadCouncilMember = async (req, res) => {
    try {
        let { name, company, category } = req.body;

        if (Array.isArray(name)) name = name.join(", ");
        if (Array.isArray(company)) company = company.join(", ");

        if (!name || !company || !category || !req.file) {
            return res.status(400).json({ message: 'Name, Company, Category, and Image are required.' });
        }

        if (!allowedCouncilCategories.includes(category.toLowerCase())) {
            return res.status(400).json({ message: `Invalid category. Allowed categories: ${allowedCouncilCategories.join(', ')}` });
        }

        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        const newMember = new CouncilMembers({
            name,
            company,
            category,
            imgpath: cloudinaryResult.secure_url,
            imgName: cloudinaryResult.public_id
        });

        await newMember.save();
        res.status(201).json({ message: 'Council Member added successfully!', member: newMember });

    } catch (err) {
        console.error('Error saving council member:', err);
        res.status(500).json({ message: 'Error saving council member', error: err.message });
    }
};

// Get all council members or by category (READ)
const getCouncilMembers = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category: category.toLowerCase() } : {};

        const members = await CouncilMembers.find(filter);
        res.status(200).json(members);

    } catch (err) {
        console.error('Error retrieving council members:', err);
        res.status(500).json({ message: 'Error retrieving council members', error: err.message });
    }
};

// Update council member (UPDATE)
// Update a council member
const updateCouncilMember = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, company, category } = req.body;

        // Convert name & company to string if they're arrays
        if (Array.isArray(name)) name = name.join(", ");
        if (Array.isArray(company)) company = company.join(", ");

        // Validate inputs
        if (!name || !company || !category) {
            return res.status(400).json({ message: 'Name, Company, and Category are required.' });
        }

        // Validate category
        if (!allowedCouncilCategories.includes(category.toLowerCase())) {
            return res.status(400).json({ message: `Invalid category. Allowed categories: ${allowedCouncilCategories.join(', ')}` });
        }

        // Find existing council member
        let councilMember = await CouncilMembers.findById(id);
        if (!councilMember) {
            return res.status(404).json({ message: 'Council member not found.' });
        }

        // Upload new image if provided
        if (req.file) {
            // Delete old image from Cloudinary
            if (councilMember.imgName) {
                await cloudinary.uploader.destroy(councilMember.imgName);
            }

            // Upload new image
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            councilMember.imgpath = cloudinaryResult.secure_url;
            councilMember.imgName = cloudinaryResult.public_id;
        }

        // Update member details
        councilMember.name = name;
        councilMember.company = company;
        councilMember.category = category;
        
        await councilMember.save();
        res.status(200).json({ message: 'Council Member updated successfully!', member: councilMember });

    } catch (err) {
        console.error('Error updating council member:', err);
        res.status(500).json({ message: 'Error updating council member', error: err.message });
    }
};

module.exports = { updateCouncilMember };


// Delete council member (DELETE)
const deleteCouncilMember = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Council member ID is required' });

        const member = await CouncilMembers.findById(id);
        if (!member) return res.status(404).json({ message: 'Council member not found' });

        await cloudinary.uploader.destroy(member.imgName); // Delete image from Cloudinary
        await CouncilMembers.findByIdAndDelete(id);

        res.status(200).json({ message: 'Council Member deleted successfully!' });

    } catch (err) {
        console.error('Error deleting council member:', err);
        res.status(500).json({ message: 'Error deleting council member', error: err.message });
    }
};

module.exports = {
    uploadCouncilMember,
    getCouncilMembers,
    updateCouncilMember,
    deleteCouncilMember,
    upload
};
