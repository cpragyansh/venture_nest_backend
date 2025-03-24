const express = require("express");
const router = express.Router();
const PatentsFiled = require("../../models/PatentsFiled");

// Create Patent
router.post("/addpatent", async (req, res) => {
  try {
    const patent = new PatentsFiled(req.body);
    await patent.save();
    res.status(201).send("Patent added successfully.");
  } catch (error) {
    res.status(500).send("Error adding patent.");
  }
});

// Get All Patents
router.get("/getpatent", async (req, res) => {
  try {
    const patents = await PatentsFiled.find();
    res.status(200).json(patents);
  } catch (error) {
    res.status(500).send("Error fetching patents.");
  }
});

// Update Patent
router.put("/updatepatent", async (req, res) => {
  try {
    const { _id, ...updatedData } = req.body;
    await PatentsFiled.findByIdAndUpdate(_id, updatedData);
    res.status(200).send("Patent updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating patent.");
  }
});

// Delete Patent
router.delete("/removepatent", async (req, res) => {
  try {
    await PatentsFiled.findByIdAndDelete(req.body._id);
    res.status(200).send("Patent deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting patent.");
  }
});

module.exports = router;
