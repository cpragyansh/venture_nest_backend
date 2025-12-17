const express = require('express');
const router = express.Router();
const {
    FounderDetUpload,
    FounderImgGetfromserver,
    FounderImgGet,
    upload,
    markStarredStory,
    StarredStory,
    updateSuccessStory
} = require('../../controllers/application/SuccessStories');
const SuccessStories = require('../../models/SuccessStories');

// CREATE (with two image fields)
router.post('/successstory', upload, FounderDetUpload);

// READ
router.get('/getsuccess', FounderImgGet);
router.get('/successstory/:filename', FounderImgGetfromserver);
router.get('/starred-stories', StarredStory);

// UPDATE
router.put('/successstory/:id', upload, updateSuccessStory);

// DELETE
router.delete('/successstory/:id', async (req, res) => {
    try {
        const story = await SuccessStories.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting story', error: err });
    }
});

// STAR / UNSTAR
router.post('/success-mark-starred', markStarredStory);
// READ SINGLE STARRED STORY BY ID (DETAIL PAGE)
router.get('/starred-stories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const story = await SuccessStories.findById(id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching story details',
            error: error.message
        });
    }
});


module.exports = router;
