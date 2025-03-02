const express = require('express');
const { uploadCouncilMember, getCouncilMembers, upload } = require('../../controllers/application/CouncilMembers');

const router = express.Router();

// Upload new council member
router.post('/council-member', upload.single('image'), uploadCouncilMember);

// Get council members by category
router.get('/council-members', getCouncilMembers);

module.exports = router;
