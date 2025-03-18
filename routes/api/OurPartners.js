const express = require('express');
const router = express.Router();
const { OurPartnersImgUpload, OurPartnersGetImg } = require('../../controllers/application/OurPartners');
const OurPartners = require('../../models/OurPartners');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// POST - Upload Partner
router.post('/ourpartner', upload.single('image'), OurPartnersImgUpload);

// GET - Retrieve Partners
router.get('/getpartner', OurPartnersGetImg);

// PUT - Update Partner
router.put('/updatepartner/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const updateData = { Name: name, Category: category };

        // If a new image is uploaded, update Cloudinary URL
        if (req.file) {
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            updateData.imgpath = cloudinaryResult.secure_url;
            updateData.imgName = cloudinaryResult.public_id;
        }

        const updatedPartner = await OurPartners.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedPartner);
    } catch (err) {
        res.status(500).json({ message: "Error updating partner", error: err.message });
    }
});

// DELETE - Remove Partner
router.delete('/deletepartner/:id', async (req, res) => {
    try {
        await OurPartners.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Partner deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting partner", error: err.message });
    }
});

module.exports = router;
