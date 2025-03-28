import React, { useEffect, useState } from "react";
import axios from "axios";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [updatedData, setUpdatedData] = useState({ title: "", description: "" });
  const [viewingBlog, setViewingBlog] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/blogs");
        setBlogs(response.data.allBlogs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Delete a blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/user/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      alert("Error deleting blog: " + err.response?.data?.message);
    }
  };

  // Open edit modal
  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setUpdatedData({ title: blog.title, description: blog.description, image: blog.image });
  };

  const viewFullBlog = (blog) => {
    setViewingBlog(blog);
  }

  // Update blog data
  const handleUpdate = async () => {
    if (!updatedData.title || !updatedData.description) {
      alert("Title and description are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/user/blogs/${editingBlog._id}`, updatedData);
      setBlogs(blogs.map((blog) => (blog._id === editingBlog._id ? response.data.updatedBlog : blog)));
      setEditingBlog(null);
    } catch (err) {
      alert("Error updating blog: " + err.response?.data?.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">All Blogs</h1>
      <div className="grid md:grid-cols-2 gap-6 ">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded shadow-md bg-white flex flex-col">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h2 className="text-lg font-semibold">{blog.title}</h2>
          <p className="text-gray-600 flex-grow">{blog.description}</p> {/* Added flex-grow here */}
          <div className="flex justify-between mt-3">
            <button
              onClick={() => handleEditClick(blog)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => viewFullBlog(blog)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              View
            </button>
          </div>
        </div>
        
        ))}
      </div>

      {viewingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">{viewingBlog.title}</h2>
            <img src={viewingBlog.image} alt={viewingBlog.title} className="w-full h-48 object-cover rounded mb-3" />
            <p className="text-gray-700">{viewingBlog.description}</p>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setViewingBlog(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">Edit Blog</h2>
            <input
              type="text"
              value={updatedData.title}
              onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Title"
            />
            <textarea
              value={updatedData.description}
              onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditingBlog(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
