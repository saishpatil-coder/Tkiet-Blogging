import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function BlogSubmissionForm() {
  const [formData, setformData] = useState({
    title: "",
    author: "",
    content: "",
    tags: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Set author when `authState.user` changes
  useEffect(() => {
    setformData((prevData) => ({ ...prevData, author: authState.user }));
  }, [authState.user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setformData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMessage(""); // Clear previous responses

    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";

    // Sanitize tags
    const sanitizedTags = formData.tags.trim() ? formData.tags : null;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/newPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, tags: sanitizedTags }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Blog submitted successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setResponseMessage(
          result.message || "Submission failed. Please try again."
        );
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Your Own Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Author */}
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author Name
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            disabled
            value={formData.author}
            required
          />
        </div>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
            minLength={20}
          ></textarea>
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags (Comma Separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., Poem, Blog, Confession"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      {/* Response Message */}
      {responseMessage && (
        <div
          className={`mt-3 alert ${
            responseMessage.includes("success")
              ? "alert-success"
              : "alert-danger"
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
}

export default BlogSubmissionForm;
