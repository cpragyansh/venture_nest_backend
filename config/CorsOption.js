const AllowedOrigan = require('./AllowedOrigan'); // Import allowed origins

class CorsHandler {
    constructor(allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    validateOrigin(origin, callback) {
        console.log('Incoming Origin:', origin || 'No Origin'); // Log incoming origin
        if (!origin) {
            console.log('Request has no origin, allowing.');
            callback(null, true); // Allow server-side requests
        } else if (this.allowedOrigins.indexOf(origin) !== -1) {
            console.log(`Origin ${origin} is allowed.`);
            callback(null, true); // Allow listed origins
        } else {
            console.log(`Origin ${origin} is not allowed.`);
            callback(new Error('Not allowed by CORS'));
        }
    }

    getCorsOptions() {
        return {
            origin: (origin, callback) => {
                this.validateOrigin(origin, callback);
            },
            optionsSuccessStatus: 204, // Use 204 for better compatibility
        };
    }
}

// Usage
const corsHandler = new CorsHandler(AllowedOrigan);
const corsOptions = corsHandler.getCorsOptions();

module.exports = corsOptions;
