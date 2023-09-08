const Message = require("../models/Message");
const io = require("../helper/socket");

exports.postMessage = async (req, res, next) => {
  try {
    // Extract data from the request body
    const { text, user } = req.body;

    // Create a new message document
    const newMessage = new Message({
      text,
      user, // Assuming user is the ID of the user who sent the message
    });

    // Save the message to the database
    await newMessage.save();
    await newMessage.populate("user");
    io.getIo().emit("message", { action: "createMessage", newMessage });

    // Return a response with the newly created message
    return res.status(201).json({
      ok: true,
      message: "Message posted successfully",
      data: newMessage, // You can send the newly created message back to the client if needed
    });
  } catch (err) {
    console.error("Error posting message:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    // Fetch all messages and populate the 'user' field
    console.log(req.user.userId);
    const messages = await Message.find().populate("user");

    // Format the messages as desired
    const formattedMessages = messages.map((msg) => ({
      sender: req.user.userId.toString() === msg.user._id.toString(),
      user: {
        username: msg.user.username,
        id: msg.user._id.toString(),
      },
      message: msg.text,
    }));

    return res.status(200).json({
      ok: true,
      message: "Messages retrieved successfully",
      data: formattedMessages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};
