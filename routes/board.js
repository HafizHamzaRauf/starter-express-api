const express = require("express");

const boardController = require("../controllers/board");
const router = express.Router();

router.post("/addBoard", boardController.addBoard);
router.post("/addTask", boardController.addTaskToBoard);
router.delete("/deleteTask", boardController.deleteTaskById);
router.put("/editTask", boardController.editTask);
module.exports = router;
