const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";
const router = express.Router();
const messageController = require("../controllers/message");
// Define a route for user signup
router.post(
  "/message",

  messageController.postMessage
);
router.get(
  "/messages",

  async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token part

    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      // Store the user ID in the request for later use
      req.user = user;
      next();
    });
  },
  messageController.getMessage
);

module.exports = router;
