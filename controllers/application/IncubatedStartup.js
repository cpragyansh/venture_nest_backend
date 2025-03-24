const { body, validationResult } = require("express-validator");
const IncubatedStartup = require("../../models/IncubatedStartup");

// ✅ Add Startup
const HandleIncubatedStartup = [
    body("StartupName").notEmpty().withMessage("StartupName is required."),
    body("CIN").notEmpty().withMessage("CIN is required."),
    body("FounderName").notEmpty().withMessage("FounderName is required."),
    body("ProductName").notEmpty().withMessage("ProductName is required."),
    
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { StartupName, CIN, FounderName, ProductName, Website, FundingRaisedStartup, InvestmentByIncubator } = req.body;

            const existingStartup = await IncubatedStartup.findOne({ $or: [{ StartupName }, { CIN }] });

            if (existingStartup) {
                return res.status(409).json({ message: "A startup with this name or CIN already exists." });
            }

            const newStartup = new IncubatedStartup({
                StartupName,
                CIN,
                FounderName,
                Website,
                ProductName,
                FundingRaisedStartup,
                InvestmentByIncubator
            });

            await newStartup.save();

            return res.status(201).json({ message: "Incubated startup added successfully.", startup: newStartup });
        } catch (err) {
            console.error("Error adding incubated startup:", err);
            return res.status(500).json({ message: "Error adding incubated startup." });
        }
    }
];

// ✅ Get All Startups
const GetAllIncubatedStartups = async (req, res) => {
    try {
        const startups = await IncubatedStartup.find({});
        return res.status(200).json(startups);
    } catch (err) {
        console.error("Error fetching startups:", err);
        return res.status(500).json({ message: "Error fetching startups." });
    }
};

// ✅ Delete Startup
const DeleteIncubatedStartup = async (req, res) => {
    try {
        const { startupId } = req.params; 
        if (!startupId) {
            return res.status(400).json({ message: "Startup ID is required." });
        }

        const deletedStartup = await IncubatedStartup.findByIdAndDelete(startupId);
        if (!deletedStartup) {
            return res.status(404).json({ message: "Startup not found." });
        }

        return res.status(200).json({ message: "Startup deleted successfully." });
    } catch (error) {
        console.error("Error deleting startup:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    HandleIncubatedStartup,
    GetAllIncubatedStartups,
    DeleteIncubatedStartup
};
