const Mentor = require('../../models/Mentors.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../../config/cloudinary')

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null, 'uploads/Mentors/');

    },
    filename: function(req,file,cb){
        cb(null , file.filedname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({storage:storage}).fields([
    {name:'MentorImage',maxCount:1},
]);

const MentorDetailsUpload = async(req,res)=>{
    try{
        const {MentorName,MentorBio,MentorExpertise,Linkdin} = req.body;
        const files = req.files;

        if(!MentorName ||!MentorBio ||!MentorExpertise ||!Linkdin){
            return res.status(400).json({message:"All fileds are required"});
        }

            const mentorImageResult = await cloudinary.uploader.upload(files.MentorImage[0].path);

        const newMentor = new Mentor({
            MentorName,
            MentorBio,
            MentorImage: mentorImageResult.secure_url,
            MentorExpertise,
            Linkdin
        });
        await newMentor.save();
        res.status(200).send('Mentor saved successfully!');

    }
catch (err) {
        console.error('Error saving Mentor:', err);
        res.status(500).send('Error saving Mentor: ' + err);
    }
};

const getAllMentors = async(req,res) =>{

try{
    const data = await Mentor.find({});
    res.status(200).json(data);
    if(!data || data.length == 0){
        return res.status(400).json({message:"No mentors found"});
} 
console.log(`Found Mentors Data ${data}`);
// res.status(200).json(data);
}catch(err){
    console.error('Error fetching mentors:', err);
    res.status(500).send('Error fetching mentors: ' + err);
}
}

module.exports = {
    upload,
    MentorDetailsUpload,
    getAllMentors
};
        