const express = require('express');
const router = express.Router();
const {
    FounderDetUpload,
    FounderImgGetfromserver,
    FounderImgGet,
    upload
} = require('../../controllers/application/SuccessStories');

// POST request to upload founder's image, startup name, and startup description
router.post('/successstory', upload.single('FounderImg'), FounderDetUpload);

// GET request to retrieve a founder's image by filename
router.get('/successstory/:filename', FounderImgGetfromserver);

// GET request to retrieve all success stories from the database
router.get('/getsuccess', FounderImgGet);

module.exports = router;
