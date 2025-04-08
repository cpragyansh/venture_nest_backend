const mongoose = require("mongoose");

const IncubatedStartupSchema = new mongoose.Schema(
  {
    StartupName: { type: String, required: true },
    CIN: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9]+$/, // Allows letters and numbers
    },
    FounderName: { type: String, required: true },
    Website: { type: String },
    ProductName: { type: String, required: true },
    FundingRaisedStartup: { type: String, default: null },
    InvestmentByIncubator: { type: String, default: null },
    StartupType: {
      type: String,
      enum: ["Virtual", "Physical"], // Only "Virtual" or "Physical" allowed
      required: true,
    },
    RegistrationStatus: {
      type: String,
      enum: ["Private Limited", "Partnership", "Proprietorship", "Not Registered" , "DIPP No"], // Only "Virtual" or "Physical" allowed
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncubatedStartup", IncubatedStartupSchema);
