const mongoose = require('mongoose');

const govPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('GovPartners', govPartnerSchema);
