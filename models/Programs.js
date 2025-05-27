// /models/Event.js
const mongoose = require('mongoose');

// Define the Event schema
const programSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true
    },
    programDate: {
        type: Date,
        required: true
    },
    programTitle: {
        type: String,
        required: true
    },
    programDescription: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
    ,
    isStarred: {
        type: Boolean,
        default: false // By default, events are not starred
    }
});

// Create and export the Event model
const Program = mongoose.model('Program', programSchema);
module.exports = Program;
