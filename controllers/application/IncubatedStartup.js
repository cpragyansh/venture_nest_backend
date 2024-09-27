const { body, validationResult } = require('express-validator');
const IncubatedStartup = require('../../models/IncubatedStartup'); // Ensure the correct path to the model

const HandleIncubatedStartup = [
    // Validation rules
    body('StartupName').notEmpty().withMessage('StartupName is required.'),
    body('CIN').notEmpty().withMessage('CIN is required.'),
    body('FounderName').notEmpty().withMessage('FounderName is required.'),
    body('ProductName').notEmpty().withMessage('ProductName is required.'),
    
    async (req, res) => {
        try {
            // Check validation results
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { StartupName, CIN, FounderName, ProductName, Website, FundingRaisedStartup, InvestmentByIncubator } = req.body;

            // Check if a startup with the same StartupName or CIN already exists
            const existingStartup = await IncubatedStartup.findOne({
                $or: [{ StartupName }, { CIN }]
            });

            if (existingStartup) {
                return res.status(409).send('A startup with this name or CIN already exists.');
            }

            // Create a new IncubatedStartup document with the provided data
            const newData = new IncubatedStartup({
                StartupName,
                CIN,
                FounderName,
                Website,
                ProductName,
                FundingRaisedStartup,
                InvestmentByIncubator
            });

            // Save the new document to the database
            await newData.save();

            // Log success and send a success response
            console.log('New Startup Added:', newData);
            return res.status(200).send('Incubated startup added successfully.');
        } catch (err) {
            // Handle errors
            console.error('Error adding incubated startup:', err);
            return res.status(500).send('Error adding incubated startup.');
        }
    }
];

// Function to get all incubated startups from the database
const GetAllIncubatedStartups = async (req, res) => {
    try {
        // Fetch all IncubatedStartup documents from the database
        const startups = await IncubatedStartup.find({});

        if (!startups || startups.length === 0) {
            return res.status(404).send('No incubated startups found.');
        }

        // Log the number of startups found and return the data
        console.log(`Found ${startups.length} incubated startups.`);
        return res.status(200).json(startups);
    } catch (err) {
        // Handle errors
        console.error('Error fetching incubated startups:', err);
        return res.status(500).send('Error fetching incubated startups.');
    }
};
// Function to delete an incubated startup
const DeleteIncubatedStartup = async (req, res) => {
    const { StartupName, CIN } = req.body;
    
    try {
        if (!StartupName || !CIN) {
            return res.status(400).send('StartupName and CIN are required.');
        }

        // Find and delete the startup by StartupName and CIN
        const deletedStartup = await IncubatedStartup.findOneAndDelete({
            StartupName,
            CIN
        });

        if (!deletedStartup) {
            return res.status(404).send('No startup found with the given name and CIN.');
        }

        // Log success and send success response
        console.log('Startup Deleted:', deletedStartup);
        return res.status(200).send(`Startup '${StartupName}' deleted successfully.`);
    } catch (err) {
        // Handle errors
        console.error('Error deleting startup:', err);
        return res.status(500).send('Error deleting startup.');
    }
};
module.exports = {
    HandleIncubatedStartup,
    GetAllIncubatedStartups,
    DeleteIncubatedStartup
};
