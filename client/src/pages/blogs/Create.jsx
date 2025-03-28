import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBlogForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !image) {
      setMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:8000/api/user/blogs/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      if (data.success) {
        setMessage("Blog created successfully!");
        navigate('/all-blogs')
        setTitle("");
        setDescription("");
        setImage(null);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setMessage("Failed to create blog.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-32">
      <h2 className="text-xl font-bold mb-4">Create a New Blog</h2>

      {message && <p className="text-blue-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded h-24"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Submitting..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogForm;
