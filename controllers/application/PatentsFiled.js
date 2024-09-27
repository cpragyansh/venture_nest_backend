const PatentsFiled = require('../../models/PatentsFiled'); // Ensure the correct path to the model

// Function to handle the submission of new patents filed
const HandlePatentsFiled = async (req, res) => {
    try {
        const { PatentTitle, Inventor, ApplicationNo, PatentYear } = req.body;

        // Validate that all required fields are provided
        if (!PatentTitle || !Inventor || !ApplicationNo || !PatentYear) {
            return res.status(400).send('PatentTitle, Inventor, ApplicationNo, and PatentYear are required.');
        }

        // Check if a patent with the same PatentTitle or ApplicationNo already exists
        const existingPatent = await PatentsFiled.findOne({
            $or: [{ PatentTitle }, { ApplicationNo }]
        });

        if (existingPatent) {
            return res.status(409).send('A Patent with this Title or Application No. already exists.');
        }

        // Create a new PatentsFiled document with the provided data
        const newPatent = new PatentsFiled({
            PatentTitle,
            Inventor,
            ApplicationNo,
            PatentYear
        });

        // Save the new patent to the database
        await newPatent.save();

        // Log success and send a success response
        console.log('New Patent Added:', newPatent);
        return res.status(200).send('Patent filed successfully.');
    } catch (err) {
        // Handle errors
        console.error('Error adding patent:', err);
        return res.status(500).send('Error adding patent.');
    }
};

// Function to get all patents filed from the database
const GetAllPatentsFiled = async (req, res) => {
    try {
        // Fetch all PatentsFiled documents from the database
        const patents = await PatentsFiled.find({});

        if (!patents || patents.length === 0) {
            return res.status(404).send('No Patents found.');
        }

        // Log the number of patents found and return the data
        console.log(`Found ${patents.length} Patents Filed.`);
        return res.status(200).json(patents);
    } catch (err) {
        // Handle errors
        console.error('Error fetching patents:', err);
        return res.status(500).send('Error fetching patents.');
    }
};

module.exports = {
    HandlePatentsFiled, // Corrected export for this function
    GetAllPatentsFiled  // Corrected export for this function
};
