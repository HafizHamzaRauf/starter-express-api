const express = require("express");
const db = require("./helper/db.js");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.js");
const boardRoutes = require("./routes/board.js");
const app = express();

const cors = require("cors");

app.use(cors());

app.use(bodyParser.json());
app.use(authRoutes);
app.use(boardRoutes);

app.use("/", (req, res, next) => {
  return res.status(210).json({ message: "app is running" });
});

const startServer = async () => {
  try {
    await db.makeConnection(); // Establish the database connection first

    // Now that the database connection is established, start the server
    await app.listen(process.env.PORT || 4000);
    console.log("Server is running on port", process.env.PORT || 4000);
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
