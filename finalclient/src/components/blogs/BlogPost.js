import React, { useState } from "react";

function BlogPost({ author, content, createdAt }) {
  // State to track likes
  const [likeCount, setLikeCount] = useState(0);

  // Function to handle like button click
  const handleLike = () => {
    setLikeCount(likeCount + 1); // Increment the like count
  };

  return (
    <div className="blog-post border p-4 rounded shadow-sm my-3">
      {/* Blog Header */}
      <div className="blog-header mb-3">
        <h2 className="author-name mb-1">{author}</h2>
        <p className="created-at text-muted">
          Created at:{" "}
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Blog Content */}
      <div className="blog-content mb-3">
        <p>{content}</p>
      </div>

      {/* Blog Footer */}
      <div className="blog-footer d-flex align-items-center">
        {/* Like Button */}
        <button className="btn btn-outline-primary me-2" onClick={handleLike}>
          Like ❤️
        </button>
        {/* Like Count */}
        <span>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>
    </div>
  );
}

export default BlogPost;
