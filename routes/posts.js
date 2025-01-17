import express from "express";
import pool from "../db.js"; // Import your database connection
import authenticateJWT from "../middlewares/authJWT.js";
const postRouter = express.Router();
import jwt from "jsonwebtoken";

// Get all Blogs
// Middleware to check if the user owns the post
const verifyPostOwner = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    const query = `SELECT * FROM Blogs WHERE id = $1 AND user_id = $2;`;
    const result = await pool.query(query, [postId, userId]);

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You do not have permission to modify this post" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error verifying post ownership" });
  }
};

// Use this middleware for update and delete routes
postRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  let userId = null; // Set to null instead of an empty string for clarity
  const token = req.cookies.authToken; // Get token from 'Authorization' header

  // If no token exists, userId remains null
  if (!token) {
    console.log("No token provided");
    userId = null;
  }

  // Decode JWT token to get userId
  try {
    if (token) {
      // Asynchronously verify the token
      const decoded = await jwt.verify(token, "your_jwt_secret_key");
      userId = decoded.userId; // Get userId from decoded token
      console.log("Decoded token:", decoded);
    }
  } catch (error) {
    console.log("JWT verification error:", error);
    userId = null; // In case of error, userId remains null
  }
  try {
    // Query to fetch blogs and check if the user has liked them
    const query = `
      SELECT 
        blogs.id, 
        blogs.title, 
        blogs.content,
        blogs.author,
        blogs.created_at,
        blogs.user_id,
        blogs.tags,
        CASE 
          WHEN likes.user_id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS has_liked
      FROM blogs
      LEFT JOIN likes ON blogs.id = likes.post_id AND likes.user_id = $1
      ORDER BY blogs.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    // Execute query with userId (for checking likes) and pagination
    const result = await pool.query(query, [userId, limit, offset]);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching paginated posts" });
  }
});

// Get a specific post
postRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Blogs WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

// Create a new post
postRouter.post("/newPost", authenticateJWT, async (req, res) => {
  let { title, content, author, tags } = req.body;
  const userId = req.user.userId;

  try {
    tags = tags ? (tags.trim() ? tags.split(",") : null) : null;
    const query = `
      INSERT INTO Blogs (title, content, user_id,author,tags)
      VALUES ($1, $2, $3 , $4,$5) RETURNING *;
    `;
    const result = await pool.query(query, [
      title,
      content,
      userId,
      author,
      tags,
    ]);
    res
      .status(201)
      .json({ message: "Post created successfully", post: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post" });
  }
});

postRouter.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const query = `
        SELECT * FROM Blogs
        WHERE title ILIKE $1 OR content ILIKE $1;
      `;
    const result = await pool.query(query, [`%${q}%`]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error performing search" });
  }
});

// Update a post
postRouter.put("/:id", authenticateJWT, verifyPostOwner, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await pool.query("SELECT * FROM Blogs WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (result.rows[0].user_id !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    const updateQuery = `
      UPDATE Blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *;
    `;
    const updatedPost = await pool.query(updateQuery, [title, content, id]);
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Delete a post
postRouter.delete(
  "/:id",
  authenticateJWT,
  verifyPostOwner,
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM Blogs WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (result.rows[0].user_id !== req.user.userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post" });
      }

      await pool.query("DELETE FROM Blogs WHERE id = $1", [id]);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting post" });
    }
  }
);
postRouter.post("/:postId/like", authenticateJWT, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    const query = `
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, user_id) DO NOTHING;
      `;
    await pool.query(query, [postId, userId]);
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error liking the post" });
  }
});
postRouter.get("/:postId/likes", async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1;`;
    const result = await pool.query(query, [postId]);
    res.status(200).json({ likeCount: result.rows[0].like_count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching like count" });
  }
});

export default postRouter;
