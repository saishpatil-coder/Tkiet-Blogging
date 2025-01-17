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

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
