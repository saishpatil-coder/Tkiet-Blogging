import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function BlogPost({
  title,
  author,
  content,
  createdAt,
  tags,
  has_liked,
  user_id,
  blog_id,
}) {
  let [liked, setLiked] = useState(has_liked);
  const [likeCount, setLikeCount] = useState(0);
  let { authState } = useAuth();
  let navigate = useNavigate("");
  const handleLike = async () => {
    if (!liked) {
      if (!authState.isLoggedIn) navigate("/login");
      let response = await fetch(
        `http://localhost:3003/posts/${blog_id}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      let result = await response.json();
      console.log(result);
      setLikeCount(likeCount + 1);
    }else{

    }
  };

  // Function to calculate relative time
  const calculateRelativeTime = (date) => {
    const now = new Date();
    const postedDate = new Date(date);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  return (
    <div className="blog-post border p-3 rounded shadow-sm my-3">
      {/* Blog Header */}
      <div className="blog-header mb-2">
        <h1 className="author-name mb-1" style={{ fontSize: "0.9rem" }}>
          {author}
        </h1>
      </div>

      {/* Blog Content (Image Placeholder) */}
      <div
        className="content-box border p-3 mb-3"
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <p
          className="text-muted text-center mb-0"
          style={{ fontSize: "0.9rem" }}
        >
          {content}
        </p>
      </div>

      {/* Blog Title */}
      <h6 className="blog-title text-primary mb-2" style={{ fontSize: "1rem" }}>
        {title}
      </h6>

      {/* Blog Tags */}
      <div className="blog-tags mb-2">
        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="badge bg-secondary me-2"
              style={{ fontSize: "0.75rem" }}
            >
              #{tag}
            </span>
          ))}
      </div>

      {/* Blog Footer */}
      <div className="blog-footer d-flex align-items-center">
        {/* Like Button */}
        <button
          className={`btn ${
            liked ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          style={{ fontSize: "0.8rem", padding: "4px 8px" }}
          onClick={handleLike}
        >
          {liked ? "Unlike ❤️" : "Like ❤️"}
        </button>

        {/* Like Count */}
        <span style={{ fontSize: "0.8rem" }}>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>
      <p className="created-at text-muted my-2" style={{ fontSize: "0.8rem" }}>
        Posted {calculateRelativeTime(createdAt)}
      </p>
    </div>
  );
}

export default BlogPost;
