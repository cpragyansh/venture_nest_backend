const express = require('express');
const router = express.Router();
const {
    HandlePatentsFiled, 
    GetAllPatentsFiled,DeletePatent
} = require('../../controllers/application/PatentsFiled');

router.post('/addpatent',HandlePatentsFiled);
router.get('/getpatent', GetAllPatentsFiled);
router.delete('/removepatents', DeletePatent);

module.exports = router;
