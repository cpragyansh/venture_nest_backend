const express = require('express');
const { uploadCouncilMember, getCouncilMembers, updateCouncilMember, deleteCouncilMember, upload } = require('../../controllers/application/CouncilMembers');

const router = express.Router();

// Create a new council member
router.post('/council-member', upload.single('image'), uploadCouncilMember);

// Get all council members or filter by category
router.get('/council-members', getCouncilMembers);

// Update a council member by ID
router.put('/council-member/:id', upload.single('image'), updateCouncilMember);

// Delete a council member by ID
router.delete('/council-member/:id', deleteCouncilMember);

module.exports = router;
