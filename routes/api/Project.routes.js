const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const Projects = require('../../models/Projects.model');
const router = express.Router();
const { ProjectDetailsUpload, upload, getAllProjects } = require('../../controllers/application/Project');

// CREATE (with multiple image fields)
router.post('/project', upload, ProjectDetailsUpload);
router.get("/projects", getAllProjects);

module.exports = router