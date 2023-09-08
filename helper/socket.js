const socket = require("socket.io");
let io;
exports.initSocket = (server) => {
  io = socket(server, {
    cors: {
      origin: "https://live2chatting.netlify.app", // Replace with your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
};
exports.getIo = () => {
  if (io) return io;
};
