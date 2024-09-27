const mongoose = require('mongoose');

const OurPartnersSchema = new mongoose.Schema({
    Name: { type: String, required: true }, // Ensures Name is required
    imgpath: { type: String, required: true }, // Ensures imgpath is required
    imgName:{type:String,require:true},
    Category: { type: String, required: true }, // Ensures Name is required
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OurPartners', OurPartnersSchema);
