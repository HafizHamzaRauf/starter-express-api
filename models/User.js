const mongoose = require("mongoose");

// Define the Subtask Schema
const subtaskSchema = new mongoose.Schema({
  id: String,
  name: String,
  done: Boolean,
});

// Define the Task Schema
const taskSchema = new mongoose.Schema({
  id: String,
  heading: String,
  description: String,
  status: String,
  subTasks: [subtaskSchema], // Array of subtasks
});

// Define the Board Schema
const boardSchema = new mongoose.Schema({
  id: String,
  name: String,
  tasks: [taskSchema], // Array of tasks
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  boards: [boardSchema], // Array of boards
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
