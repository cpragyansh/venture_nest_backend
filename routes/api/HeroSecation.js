const express = require('express');
const router = express.Router();
const { HeroSectionImgUpload, HeroSectionGetImg,  HeroSectionDeleteImg ,upload  } = require('../../controllers/application/Hero_Section_img');

// Route to handle image upload
router.post('/upload', upload.fields([{ name: 'mobile' }, { name: 'tablet' }, { name: 'laptop' }, { name: 'desktop' }]), HeroSectionImgUpload);

// Route to get HeroSection images
router.get('/images', HeroSectionGetImg);
// Route to delete an image from HeroSection
router.delete('/delete', HeroSectionDeleteImg);


module.exports = router;
