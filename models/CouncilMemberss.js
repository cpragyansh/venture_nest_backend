const mongoose = require('mongoose');

const CouncilMemberSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Member's name
    company: { type: String, required: true }, // Company name
    category: { type: String, required: true }, // Category (e.g., "Tech", "Advisory")
    imgpath: { type: String, required: true }, // Cloudinary image URL
    imgName: { type: String, required: true } // Cloudinary public ID
});

module.exports = mongoose.model('CouncilMembers', CouncilMemberSchema);
