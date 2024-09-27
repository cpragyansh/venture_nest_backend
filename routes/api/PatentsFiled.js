const express = require('express');
const router = express.Router();
const {
    HandlePatentsFiled, 
    GetAllPatentsFiled
} = require('../../controllers/application/PatentsFiled');

router.post('/addpatent',HandlePatentsFiled);
router.get('/getpatent', GetAllPatentsFiled);
router.delete('/patents/:id', DeletePatent); // Add this line for delete

module.exports = router;
