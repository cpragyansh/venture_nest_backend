const mangoose = require('mongoose');

const ProjectsSchema = new mangoose.Schema({
    ProjectName: { type: String, required: true },
    ProjectDescription: { type: String, required: true },
    ProjectImages: [
        {
            type: String,
            required: true,
        }   
    ],
    ProjectmainImage: { type: String, required: true },
    Projecttagline:{type:String },
    ProjectMadeBy: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mangoose.model('Projects', ProjectsSchema);