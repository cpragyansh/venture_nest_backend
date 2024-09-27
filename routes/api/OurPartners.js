const express = require('express');
const router = express.Router();
const { OurPartnersImgUpload, OurPartnersGetImg, OurPartnersImgGet, upload } = require('../../controllers/application/OurPartners');

// POST request to upload partner's name and image
router.post('/ourpartner', upload.single('image'), OurPartnersImgUpload);


// GET request to retrieve all partner data (names and images)
router.get('/getpartner', OurPartnersGetImg);

// GET request to serve a specific partner image by filename
router.get('/ourpartner/:filename', OurPartnersImgGet);

module.exports = router;
