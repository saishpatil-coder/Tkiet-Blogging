import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogPost";

function Blogs() {
  const [blogData, setBlogData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result[0]);
        setBlogData(result); // Assuming the response is an array of blogs
      } catch (err) {
        setError(err.message || "An error occurred while fetching blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once on mount

  if (loading) {
    return <div className="container mt-5">Loading blogs...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="app container mt-5">
      <h1 className="mb-4">Student Blogs</h1>
      <Link to="/createPost" className="btn btn-primary mb-4">
        Create New Post
      </Link>
      {blogData.length > 0 ? (
        blogData.map((blog, index) => (
          <BlogPost
            key={index}
            title={blog.title}
            author={blog.author}
            content={blog.content}
            createdAt={blog.created_at}
            tags={blog.tags}
            has_liked={blog.has_liked}
            user_id={blog.user_id}
            blog_id={blog.id}
          />
        ))
      ) : (
        <div>No blogs found. Be the first to create one!</div>
      )}
    </div>
  );
}

export default Blogs;
