const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
} = require("../../controllers/application/memberController");

// Multer Config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createMember);
router.get("/", getMembers);
router.put("/:id", upload.single("image"), updateMember);
router.delete("/:id", deleteMember);

module.exports = router;
