const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Define a User model (assuming you've already defined it as shown in the previous answer)
const User = require("../models/User");

// Define a secret key for JWT (JSON Web Tokens)
const secretKey = "your-secret-key";

exports.postSignup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Issue a token for the user (for email verification or other purposes)
    const token = jwt.sign({ userId: newUser._id }, secretKey);

    res.status(201).json({
      ok: true,
      user: newUser,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ ok: false, message: "Internal Server Error" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If the user does not exist
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "User does not exist" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey);

      return res
        .status(200)
        .json({ ok: true, message: "Login successful", token, user });
    }

    res.status(401).json({ ok: false, message: "Wrong password" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
