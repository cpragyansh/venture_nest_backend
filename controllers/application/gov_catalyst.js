const GovPartner = require('../../models/govCatelyst');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs'); // Required to delete temp files

// Upload Gov Partner Image & Save to DB
exports.addGovPartner = async (req, res) => {
    try {
        console.log("✅ addGovPartner function called"); // Debugging log
        console.log("Request Body:", req.body); // Log the request data
        console.log("Uploaded File:", req.file); // Log uploaded file info

        if (!req.body.name || !req.file) {
            console.log("❌ Missing fields: name or image");
            return res.status(400).json({ error: "Name and image file are required." });
        }

        // ✅ Simulating saving to database
        console.log(`Saving to database: Name = ${req.body.name}, Image Path = ${req.file.path}`);

        return res.status(201).json({ message: "Government Partner added successfully!" });
    } catch (error) {
        console.error("❌ Error in addGovPartner:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Gov Partners
exports.getGovPartners = async (req, res) => {
  try {
    const govPartners = await GovPartner.find(); // Fetch all Gov partners
    res.status(200).json(govPartners);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
