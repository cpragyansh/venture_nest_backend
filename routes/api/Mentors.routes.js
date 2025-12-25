const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Projects = require('../../models/Mentors.model');
const router = express.Router();
const { MentorDetailsUpload, upload, getAllMentors } = require('../../controllers/application/Mentors.controller');

// CREATE (with multiple image fields)
router.post('/mentor', upload, MentorDetailsUpload);
router.get("/mentors", getAllMentors);

module.exports = router