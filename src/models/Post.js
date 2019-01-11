// Importing modules
const mongoose = require("mongoose");

// Create Post Schema
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories"
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tags"
    }
  ],
  title: String,
  body: String,
  // visibilityState: Boolean,
  // status: String,
  date: {
    type: Date,
    default: new Date()
  }
});

// Export Post Schema
module.exports = Post = mongoose.model("posts", PostSchema);
