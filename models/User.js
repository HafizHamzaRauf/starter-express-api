const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
