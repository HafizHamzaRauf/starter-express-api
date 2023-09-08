const express = require("express");
const db = require("./helper/db.js");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.js");
const app = express();
const socketHelper = require("./helper/socket.js");
const messageRoutes = require("./routes/message.js");
const cors = require("cors");
const connectedUsers = new Set();
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // This allows cookies to be sent from the frontend
  optionsSuccessStatus: 204, // No content response for preflight requests
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(authRoutes);
app.use(messageRoutes);
app.use("/", (req, res, next) => {
  console.log("first middleware");
  return res.status(210).json({ message: " no page found" });
});
const startServer = async () => {
  try {
    const server = app.listen(process.env.PORT || 4000);
    socketHelper.initSocket(server);
    const io = socketHelper.getIo();
    io.on("connection", (socket) => {
      const username = socket.handshake.query.username;

      connectedUsers.add(username); // Add user with both ID and username

      // Remove the user from the set when they disconnect
      socket.on("disconnect", () => {
        connectedUsers.delete(username);

        io.emit("userList", Array.from(connectedUsers));
      });

      // Send an updated list of connected users to all clients
      io.emit("userList", Array.from(connectedUsers));

      // You can also log the connected users at this point
    });

    // After the server has started listening, establish the MongoDB connection
    await db.makeConnection();
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
