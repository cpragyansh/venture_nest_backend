const express = require('express');
const router = express.Router();
const { HeroSectionImgUpload, HeroSectionGetImg, upload } = require('../../controllers/application/Hero_Section_img');

// Route to handle image upload
router.post('/upload', upload.fields([{ name: 'mobile' }, { name: 'tablet' }, { name: 'laptop' }, { name: 'desktop' }]), HeroSectionImgUpload);

// Route to get HeroSection images
router.get('/images', HeroSectionGetImg);

module.exports = router;
