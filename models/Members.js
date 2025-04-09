const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  role: String,
  category: String,
  imgUrl: String,
});

module.exports = mongoose.model("Member", memberSchema);
