// /models/Event.js
const mongoose = require('mongoose');

// Define the Event schema
const photoSchema = new mongoose.Schema({
    photoName: {
        type: String,
        required: true
    },
    photoDate: {
        type: Date,
        // required: true
    },
    
    imageUrl: {
        type: String,
        required: true
    }
});

// Create and export the Event model
const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
