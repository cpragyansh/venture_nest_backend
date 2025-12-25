const Project = require('../../models/Projects.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../../config/cloudinary')

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null, 'uploads/Projects/');

    },
    filename: function(req,file,cb){
        cb(null , file.filedname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({storage:storage}).fields([
    {name:'ProjectmainImage',maxCount:1},
    {name:'ProjectImages',maxCount:6}
]);

const ProjectDetailsUpload = async(req,res)=>{
    try{
        const {ProjectName,ProjectDescription,Projecttagline,ProjectMadeBy} = req.body;
        const files = req.files;

        if(!ProjectName ||!ProjectDescription ||!Projecttagline ||!ProjectMadeBy){
            return res.status(400).json({message:"All fileds are required"});
        }

            const projectMainImgResult = await cloudinary.uploader.upload(files.ProjectmainImage[0].path);
            const ProjectImages = [];
          for(const file of files.ProjectImages){
            const result = await cloudinary.uploader.upload(file.path);
            ProjectImages.push(result.secure_url);
          }

        const newProject = new Project({
            ProjectName,
            ProjectDescription,
            ProjectmainImage: projectMainImgResult.secure_url,
            ProjectImages: ProjectImages,
            Projecttagline,
            ProjectMadeBy
        });
        await newProject.save();
        res.status(200).send('Project saved successfully!');

    }
catch (err) {
        console.error('Error saving Project:', err);
        res.status(500).send('Error saving Project: ' + err);
    }
};

const getAllProjects = async(req,res) =>{

try{
    const data = await Project.find({});
    res.status(200).json(data);
    if(!data || data.length == 0){
        return res.status(400).json({message:"No projects found"});
} 
console.log(`Found Projects Data ${data}`);
// res.status(200).json(data);
}catch(err){
    console.error('Error fetching projects:', err);
    res.status(500).send('Error fetching projects: ' + err);
}
}

module.exports = {
    upload,
    ProjectDetailsUpload,
    getAllProjects
};  