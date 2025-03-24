const mongoose = require("mongoose");

const IncubatedStartupSchema = new mongoose.Schema({
    StartupName: { 
        type: String,
        required: true 
    }, 
   CIN: { 
    type: String, 
    required: true,
    match: /^[a-zA-Z0-9]+$/ // Allows both letters and numbers
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
        default: null  
    },
    InvestmentByIncubator: { 
        type: String,
        default: null  
    }
}, { timestamps: true });

module.exports = mongoose.model("IncubatedStartup", IncubatedStartupSchema);
