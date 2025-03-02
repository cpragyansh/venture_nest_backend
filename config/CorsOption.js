// const AllowedOrigan = require('./AllowedOrigan'); // Import allowed origins

// class CorsHandler {
//     constructor(allowedOrigins) {
//         this.allowedOrigins = allowedOrigins;
//     }

//     validateOrigin(origin, callback) {
//         console.log('Incoming Origin:', origin || 'No Origin'); // Log incoming origin
//         if (!origin) {
//             console.log('Request has no origin, allowing.');
//             callback(null, true); // Allow server-side requests
//         } else if (this.allowedOrigins.indexOf(origin) !== -1) {
//             console.log(`Origin ${origin} is allowed.`);
//             callback(null, true); // Allow listed origins
//         } else {
//             console.log(`Origin ${origin} is not allowed.`);
//             callback(new Error('Not allowed by CORS'));
//         }
//     }

//     getCorsOptions() {
//         return {
//             origin: (origin, callback) => {
//                 this.validateOrigin(origin, callback);
//             },
//             optionsSuccessStatus: 204, // Use 204 for better compatibility
//         };
//     }
// }

// // Usage
// const corsHandler = new CorsHandler(AllowedOrigan);
// const corsOptions = corsHandler.getCorsOptions();

// module.exports = corsOptions;

const AllowedOrigan = require('./AllowedOrigan'); // Import allowed origins

class CorsHandler {
    constructor(allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    validateOrigin(origin, callback) {
        console.log('Incoming Origin:', origin || 'No Origin'); // Log incoming origin

        // ✅ Allow requests with no origin (Postman, server-side requests)
        if (!origin) {
            console.log('✅ Request has no origin (e.g., Postman, server-side API), allowing.');
            return callback(null, true);
        }

        // ✅ Allow listed frontend origins
        if (this.allowedOrigins.includes(origin)) {
            console.log(`✅ Origin ${origin} is allowed.`);
            return callback(null, true);
        }

        // ❌ Block unlisted origins
        console.log(`❌ Origin ${origin} is NOT allowed.`);
        return callback(new Error('Not allowed by CORS'));
    }

    getCorsOptions() {
        return {
            origin: (origin, callback) => this.validateOrigin(origin, callback),
            credentials: true, // Allow cookies/auth headers in requests
            optionsSuccessStatus: 200, // Use 200 instead of 204 for wider compatibility
        };
    }
}

// ✅ Create CORS handler
const corsHandler = new CorsHandler(AllowedOrigan);
const corsOptions = corsHandler.getCorsOptions();

module.exports = corsOptions;

