import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";
const router = express.Router();

// Register Route

// Example for isloggedin endpoint
router.get("/isloggedin", async (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.authToken; // Assuming you're using cookies to store JWT
  if (!token) {
    return res.status(400).json({ isLoggedIn: false, message: "no cookie" });
  }

  jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ isLoggedIn: false, message: "no matching cookie" });
    }
    res.status(200).json({ isLoggedIn: true, user: decoded.username });
  });
});

// Example for logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("authToken"); // Clear the auth token cookie
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/register", async (req, res) => {
  const { username, email, password, nickname } = req.body;

  // Check if user already exists
  const userCheckQuery =
    "SELECT * FROM Users WHERE email = $1 OR username = $2";
  const existingUser = await pool.query(userCheckQuery, [email, username]);

  if (existingUser.rows.length > 0) {
    return res
      .status(400)
      .json({ message: "Email or Username already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  const insertUserQuery = `
    INSERT INTO Users (username, email, password, nickname)
    VALUES ($1, $2, $3, $4) RETURNING id, username, email, nickname;
  `;
  try {
    const newUser = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      nickname,
    ]);
    const user = newUser.rows[0];
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );
    // Send success response
    res.cookie("authTocken", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const findUserQuery = "SELECT * FROM Users WHERE email = $1";
    const result = await pool.query(findUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const jwtSecret = "your_jwt_secret_key"; // Secure the secret in .env file
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Set the JWT token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: "Strict", // CSRF protection
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production (HTTPS)
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});

export default router;
