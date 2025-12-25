const mongoose  = require('mongoose')

const MentorsSchema = new mongoose.Schema({
    MentorName: { type: String, required: true },
    MentorBio: { type: String, required: true },
    MentorImage: { type: String, required: true },
    MentorExpertise: { type: [String], required: true },
    Linkdin: { type: String , required: true },
    addedAt: { type: Date, default: Date.now },
});    

module.exports = mongoose.model('Mentors', MentorsSchema);   