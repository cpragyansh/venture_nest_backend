const express = require('express');
const multer = require('multer');
const { addGovPartner, getGovPartners } = require('../../controllers/application/gov_catalyst');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('image'), addGovPartner);
router.get('/all', getGovPartners);

module.exports = router;
