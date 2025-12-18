const mongoose = require('mongoose');

// Mongoose Schema for Success Stories
const SuccessStoriesSchema = new mongoose.Schema({
    StartupName: { type: String, required: true }, // Ensures StartupName is required
    StartupAbout: { type: String, required: true }, // Ensures StartupAbout is required
    StartupDescription:{type:String,required:true},
    FounderImg: { type: String, required: true }, // Ensures FounderImg (image path) is required
    FounderImgName: { type: String, required: true }, // Ensures FounderImgName (image filename) is required
    FounderLogoImg: { type: String, required: true }, // Ensures FounderLogoImg (image path) is required
    SuccessImages:[
        {type:String,
        required:true,
        }
    ],
    StartupWebsite:{type:String},
    StartupLinkdin:{type:String}, 
    uploadedAt: { type: Date, default: Date.now }, // Automatically records the upload time
    isStarred: {
        type: Boolean,
        default: false // By default, events are not starred
    }
});

module.exports = mongoose.model('SuccessStories', SuccessStoriesSchema);
