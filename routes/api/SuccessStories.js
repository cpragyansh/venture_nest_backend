const express = require('express');
const router = express.Router();
const {
    FounderDetUpload,
    FounderImgGetfromserver,
    FounderImgGet,
    upload,
    markStarredStory,
    StarredStory
} = require('../../controllers/application/SuccessStories');

// POST request to upload founder's image, startup name, and startup description
router.post('/successstory', upload.single('FounderImg'), FounderDetUpload);

// GET request to retrieve a founder's image by filename
router.get('/successstory/:filename', FounderImgGetfromserver);

// GET request to retrieve all success stories from the database
router.get('/getsuccess', FounderImgGet);

router.post('/success-mark-starred' , markStarredStory);
router.get('/starred-stories' , StarredStory);

router.delete('/successstory/:id', async (req, res) => {
    try {
        const story = await SuccessStories.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting story', error: err });
    }
});


module.exports = router;
