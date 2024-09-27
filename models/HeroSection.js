const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
    mobile: [{
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    tablet: [{
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    laptop: [{
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    desktop: [{
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
