const mongoose = require('mongoose');

const IncubatedStartupSchema = new mongoose.Schema({
    StartupName: { 
        type: String,
        required: true
    }, 
    CIN: { 
        type: String,
        required: true
    }, 
    FounderName: { 
        type: String,
        required: true
    }, 
    Website: { 
        type: String
    }, 
    ProductName: { 
        type: String,
        required: true
    },
    FundingRaisedStartup: { 
        type: String,
        default: null  // Default to null if not provided
    },
    InvestmentByIncubator: { 
        type: String,
        default: null  // Default to null if not provided
    }
});

module.exports = mongoose.model('IncubatedStartup', IncubatedStartupSchema);
