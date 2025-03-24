const express = require("express");
const router = express.Router();
const { HandleIncubatedStartup, GetAllIncubatedStartups, DeleteIncubatedStartup} = require("../../controllers/application/IncubatedStartup");

router.post("/addstartup", HandleIncubatedStartup);
router.get("/getstartup", GetAllIncubatedStartups);
router.delete("/removestartup/:startupId", DeleteIncubatedStartup); // FIXED: Using startupId in URL
// router.put('/updatestartup/:startupId', UpdateStartup);

module.exports = router;
