require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/CorsOption');
const credentialsMiddleware = require('./middleware/credentials');
const dbconnect = require('./config/dbConnect');
const ErrorHandler = require('./middleware/ErrorHandle');
const Logger = require('./middleware/logger');
const { stack } = require('./routes/api/HeroSecation');
const path = require('path')
const Event = require('./routes/api/Event');

// Connect to the database
dbconnect.connect()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('Database connection failed', err);
        process.exit(1);
    });

const app = express();

// Use credentials middleware before CORS
app.use(credentialsMiddleware);

// Use CORS with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create an instance of the Logger class and use requestLogger
const logger = new Logger();

app.use(logger.requestLogger);


app.use('/idcard', express.static(path.join(__dirname, 'uploads/idcards')));



// Error handling middleware
const errorHandler = new ErrorHandler();
app.use(errorHandler.handleError);


// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure that views are in the correct folder


// Here our Routes 
app.use('/', require('./routes/api/HeroSecation'));
app.use('/', require('./routes/api/OurPartners'));
app.use('/', require('./routes/api/SuccessStories'));
app.use('/', require('./routes/api/IncubatedStartup'));
app.use('/', require('./routes/api/PatentsFiled'));
app.use('/', require('./routes/api/Event'));
app.use('/', require('./routes/api/photo'));



// auth 
app.use('/admin', require('./routes/UserAuth'));
app.use('/admin', require('./routes/AdminVerfication'));
app.use('/admin', require('./routes/Login'));
app.use('/admin', require('./routes/ResetPassword'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
