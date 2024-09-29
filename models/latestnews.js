// /models/Event.js
const mongoose = require('mongoose');

// Define the Event schema
const LatestnewsSchema = new mongoose.Schema({
   
    content: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

// Create and export the Event model
const Latestnews = mongoose.model('Latestnews', LatestnewsSchema);
module.exports = Latestnews;