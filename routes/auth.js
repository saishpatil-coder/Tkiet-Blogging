import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password, nickname } = req.body;

  // Check if user already exists
  const userCheckQuery =
    "SELECT * FROM Users WHERE email = $1 OR username = $2";
  const existingUser = await pool.query(userCheckQuery, [email, username]);

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "Email or Username already exists" });
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

    // Send success response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const findUserQuery = "SELECT * FROM Users WHERE email = $1";
  const result = await pool.query(findUserQuery, [email]);

  if (result.rows.length === 0) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const user = result.rows[0];

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    "your_jwt_secret_key",
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token });
});

export default router;
