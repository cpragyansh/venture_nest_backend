#Incubation Platform Backend

This project is a backend server for managing an incubation platform, handling various entities like Hero Section, Partners, Success Stories, Incubated Startups, and Patents Filed. It is built using Node.js and Express.js, and connects to a MongoDB database.

#Features
Hero Section API: Manage the hero section data, such as images and text content.
Our Partners API: Add and retrieve information about partners, including their category (e.g., Government, Investor, Mentor).
Success Stories API: Manage and display success stories of incubated startups.
Incubated Startups API: Store and manage information about startups under incubation.
Patents Filed API: Track patents filed by incubated startups.
Prerequisites
Ensure you have the following installed:

Node.js (version 14+)
MongoDB
Environment Variables
The project uses environment variables. Create a .env file in the root directory and define the following:

bash
Copy code
MONGODB_URI=mongodb://localhost:27017/incubation_platform
PORT=5000
Make sure the MongoDB URI points to your local or remote MongoDB instance.

Installation
Clone the repository:
bash
Copy code
git clone https://github.com/Shekhar0165/E_cell_backend_CGC_J.git
cd incubation-platform-backend
Install dependencies:
bash
Copy code
npm install
Configure environment variables:
Create a .env file based on the .env.example file provided in the repository and fill in the necessary values.

Start the server:
bash
Copy code
npm start
The server should now be running on http://localhost:5000.

API Endpoints
Here is an overview of the key API routes used in the project:

POST /api/herosection: Create or update hero section content.
GET /api/ourpartners: Retrieve all partners and their details.
POST /api/ourpartners: Add a new partner.
GET /api/successstories: Retrieve success stories.
POST /api/successstories: Add a success story.
GET /api/incubatedstartups: Retrieve information about incubated startups.
POST /api/incubatedstartups: Add a new incubated startup.
GET /api/patentsfiled: Retrieve information about patents filed by startups.
POST /api/patentsfiled: Add a new patent filed.
Refer to the /routes/api directory for the complete list of routes.

Middleware
CORS Handling: Managed via the cors package with custom configuration.
Credentials Middleware: Used for managing credentials for the API.
Logging Middleware: Requests are logged via a custom logger.
Error Handling Middleware: Centralized error handling to catch errors during request processing.
Error Handling
The app handles common errors such as invalid input, missing data, or database connection issues. The ErrorHandle middleware ensures that errors are properly logged and a meaningful response is returned to the client.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch for your feature: git checkout -b my-new-feature.
Commit your changes: git commit -m 'Add some feature'.
Push to the branch: git push origin my-new-feature.
Open a pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.