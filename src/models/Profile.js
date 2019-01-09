// Importing modules
const mongoose = require("mongoose");

// Create Profile Schema
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  firstName: String,
  LastName: String,
  aboutMe: String,
  image: String,
  socialLinks: {
    type: Array,
    default: []
  }
});

// Export Profile Schema
module.exports = Profile = mongoose.model("profiles", ProfileSchema);
