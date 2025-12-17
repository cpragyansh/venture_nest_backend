// /models/Event.js
const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTitle: {
        type: String,
        required: true
    },
    eventDescription: {
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
    ,
     order: Number, // <== Add this
});

// Create and export the Event model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
