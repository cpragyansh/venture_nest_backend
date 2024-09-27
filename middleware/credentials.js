const AllowedOrigins = require('../config/AllowedOrigan');

class CorsCredentialsHandler {
    constructor(allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    credentials = (req, res, next) => {
        const origin = req.headers.origin;
        if (this.allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Credentials', true);
        }
        next();
    }
}

// Usage
const corsCredentialsHandler = new CorsCredentialsHandler(AllowedOrigins);

module.exports = corsCredentialsHandler.credentials;
