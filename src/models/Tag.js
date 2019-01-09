// Importing modules
const mongoose = require("mongoose");

// Create Tag Schema
const TagSchema = new mongoose.Schema({
  name: String,
  description: String
  // slug: String
});

// Export Tag Schema
module.exports = Tag = mongoose.model("tags", TagSchema);
