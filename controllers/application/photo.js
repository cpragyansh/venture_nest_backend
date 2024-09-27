// const photo = require('../../models/photo'); // Correct model path
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Multer storage configuration for founder image uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/photo/'); // Ensure proper directory structure
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Function to handle image, name, and description upload for SuccessStories
// // const FounderDetUpload = async (req, res) => {
// const photoUpload = async (req, res) => {
//     try {
//         // Check if required fields are provided
//         if (!req.body.photoName  || !req.file) {
//             return res.status(400).send('photo name and photo Image are all required.');
//         }

//         // Create a new SuccessStories document with the uploaded data
//         // const newStory = new SuccessStories({
//         const newPhoto = new photo({
//             photoName: req.body.photoName,
//             imageUrl: req.file.path, // Save the image path
//         });

//         // Save the new document to MongoDB
//         await newPhoto.save();

//         console.log('New photo saved:', newPhoto);
//         res.status(200).send('New Photo saved successfully!');
//     } catch (err) {
//         console.error('Error saving New Photo:', err);
//         res.status(500).send('Error saving New Photo: ' + err);
//     }
// };

// // Function to get an image by filename from the 'uploads' folder
// // const FounderImgGetfromserver = (req, res) => {
// const PhotoImgGetfromserver = (req, res) => {
//     const filePath = path.join(__dirname, '../../uploads/photo', req.params.filename); // Adjust path
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             return res.status(404).send('File not found');
//         }

//         const ext = path.extname(filePath).toLowerCase();
//         let contentType = 'image/jpeg'; // Default to jpeg

//         if (ext === '.png') contentType = 'image/png';
//         if (ext === '.jpg') contentType = 'image/jpg';

//         res.setHeader('Content-Type', contentType);
//         fs.createReadStream(filePath).pipe(res); // Stream the image
//     });
// };

// // Function to get all SuccessStories images and details from the database
// // const FounderImgGet = async (req, res) => {
// const photoImgGet = async (req, res) => {
//     try {
//         // Fetch all SuccessStories documents from the database
//         const data = await photoimg.find({});

//         if (!data || data.length === 0) {
//             return res.status(404).json({ message: 'No photo found.' });
//         }

//         console.log(`Found ${data.length} photo image entries.`);
        
//         // Send the data as JSON response
//         res.status(200).json(data);
//     } catch (err) {
//         console.error('Error retrieving photo images:', err);
//         res.status(500).json({ message: 'Error retrieving photo images', error: err });
//     }
// };

// module.exports = {
//     // FounderDetUpload,
//     // FounderImgGet,
//     // FounderImgGetfromserver,
//     // upload // Export multer middleware for handling uploads
//     photoUpload,
//     photoImgGet,
//     PhotoImgGetfromserver,
//     upload
// };


