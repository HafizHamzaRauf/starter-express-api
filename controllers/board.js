const User = require("../models/User");

exports.addBoard = async (req, res, next) => {
  const { username } = req.body; // Assuming the username is passed as a parameter

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Create a new board based on the request data
    const newBoard = {
      name: req.body.boardName,
      tasks: [], // You can initialize the tasks array as empty
    };

    // Push the new board into the user's boards array
    user.boards.push(newBoard);

    // Save the updated user document
    await user.save();
    const insertedBoard = user.boards[user.boards.length - 1];

    return res.status(201).json({
      board: insertedBoard,
      ok: true,
      message: "Board added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.addTaskToBoard = async (req, res, next) => {
  const { boardId, username } = req.body; // Assuming the boardId and task data are passed in the request body

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Find the board with the given boardId in the user's boards array
    const board = user.boards.find(
      (b) => b._id.toString() === boardId.toString()
    );

    if (!board) {
      return res.status(404).json({ ok: false, message: "Board not found" });
    }

    // Create a new task based on the request data

    // Push the new task into the board's tasks array
    board.tasks.push(req.body.newTask);

    // Save the updated user document
    await user.save();

    // Return the updated board or just the newly added task as per your requirements
    return res.status(201).json({
      task: board.tasks[board.tasks.length - 1],
      ok: true,
      message: "Task added successfully to the board",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.deleteTaskById = async (req, res, next) => {
  const { username, boardId, taskId } = req.body; // Assuming the username is passed as a parameter

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Find the board that contains the task with the given taskId
    const board = user.boards.find(
      (b) => b._id.toString() === boardId.toString()
    );

    if (!board) {
      return res.status(404).json({ ok: false, message: "Board not found" });
    }

    // Remove the task with the given taskId from the board's tasks array
    board.tasks = board.tasks.filter(
      (task) => task._id.toString() !== taskId.toString()
    );

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.editTask = async (req, res, next) => {
  try {
    const { boardId, username, task } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Find the board with the given boardId in the user's boards array
    const board = user.boards.find(
      (b) => b?._id?.toString() === boardId?.toString()
    );

    if (!board) {
      return res.status(404).json({ ok: false, message: "Board not found" });
    }

    const index = board.tasks.findIndex(
      (a) => a._id.toString() === task._id.toString()
    );
    board.tasks[index] = task;
    await user.save();
    return res.status(404).json({ ok: true, message: "Edited Successful" });
  } catch (err) {
    return res.status(404).json({ ok: false, message: "Something Went wrong" });
  }
};
