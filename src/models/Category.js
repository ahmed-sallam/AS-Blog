// Importing modules
const mongoose = require("mongoose");

// Create Category Schema
const CategorySchema = new mongoose.Schema({
  name: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    default: ""
  },
  description: String
  // slug: String
});

// Export Category Schema
module.exports = Category = mongoose.model("categories", CategorySchema);
