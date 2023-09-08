const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth");
// Define a route for user signup
router.post("/signup", authController.postSignup);

// Define a route for user login
router.post("/login", authController.postLogin);

module.exports = router;
