const socket = require("socket.io");
let io;
exports.initSocket = (server) => {
  io = socket(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
};
exports.getIo = () => {
  if (io) return io;
};
