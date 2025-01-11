import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import authenticateJWT from "./middlewares/authJWT.js";
import pool from "./db.js";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser()); // Fix for cookie parser
app.use(express.json());
app.use("/api/auth", router);
app.use("/posts", postRouter);
app.get("/posts", async (req, res) => {
  try {
    // const result = await pool.query(
    //   "SELECT * FROM posts ORDER BY created_at DESC"
    // );
    const result = await pool.query("SELECT * FROM Blogs");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
