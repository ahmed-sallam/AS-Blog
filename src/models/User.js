// Importing modules
const mongoose = require("mongoose");

// Create User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: new Date()
  }
});

// Export User Schema
module.exports = User = mongoose.model("users", UserSchema);
