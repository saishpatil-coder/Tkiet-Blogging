import dotenv from "dotenv";
import express from "express";
import router from "./routes/auth.js";
import pool from "./db.js";
import postRouter from "./routes/posts.js";
import authenticateJWT from "./middlewares/authJWT.js";
dotenv.config();
const app = express();
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
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});
app.put("/posts/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Check if the post exists and if the user is the one who created it
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (result.rows[0].user_id !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    // Update the post
    const updateQuery = `
        UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;
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
app.delete("/posts/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  // Check if the post exists and if the user is the one who created it
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (result.rows[0].user_id !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // Delete the post
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
