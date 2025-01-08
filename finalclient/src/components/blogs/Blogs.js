import React from "react";
import BlogPost from "./BlogPost";

function Blogs() {
  const blogData = [
    {
      author: "John Doe",
      content: "This is a beautiful poem about life and its wonders.",
      createdAt: "2025-01-07T10:00:00Z",
    },
    {
      author: "Jane Smith",
      content: "A creative story about dreams and hope.",
      createdAt: "2025-01-06T14:30:00Z",
    },
  ];

  return (
    <div className="app container mt-5">
      <h1 className="mb-4">Student Blogs</h1>
      {blogData.map((blog, index) => (
        <BlogPost
          key={index}
          author={blog.author}
          content={blog.content}
          createdAt={blog.createdAt}
        />
      ))}
    </div>
  );
}

export default Blogs;
