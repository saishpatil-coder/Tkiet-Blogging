import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "your_jwt_secret_key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// Rate Limiting Middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many registration attempts. Please try again later.",
});

// Register Route
router.post("/register", registerLimiter, async (req, res) => {
  const { username, email, password, nickname, gender } = req.body;

  const userCheckQuery =
    "SELECT * FROM Users WHERE email = $1 OR username = $2 OR nickname = $3";
  const existingUser = await pool.query(userCheckQuery, [
    email,
    username,
    nickname,
  ]);

  if (existingUser.rows.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Email or Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const insertUserQuery = `
    INSERT INTO Users (username, email, password, nickname , gender)
    VALUES ($1, $2, $3, $4 , $5) RETURNING id, username, email, nickname ,gender;
  `;
  try {
    const newUser = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      nickname,
      gender,
    ]);
    const user = newUser.rows[0];
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      username: user.username,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Login Route
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  const findUserQuery = "SELECT * FROM Users WHERE email = $1";
  const result = await pool.query(findUserQuery, [email]);

  if (result.rows.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    username: user.username,
  });
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Check Login Status
router.get("/isloggedin", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      isLoggedIn: false,
      message: "No token found",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "your_jwt_secret_key",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          isLoggedIn: false,
          message: "Invalid token",
        });
      }
      res.status(200).json({
        success: true,
        isLoggedIn: true,
        user: decoded.username,
        message: "User is logged in",
      });
    }
  );
});

export default router;
