const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary").v2;



// CREATE a new blog
const createBlog = async(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
    try {

        const { title, description, image} = req.body;
        // cloudinary upload
    const file = req.file;
    const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const newBlog = new Blog({ title, description, image: cloudResponse.secure_url,});
        await newBlog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong", error
        })
    }
}

// RETRIEVE all blogs
const getAllBlogs = async(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
    try {
        const allBlogs = await Blog.find();
        console.log(allBlogs); 
        res.status(200).json({
            success: true,
            message: "All Blogs fetched successfully!",
            allBlogs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong", error
        }) 
    }
}

// UPDATE all blogs
const updateBlog = async(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
    try {
        const { blogId } = req.params;
        // console.log("Blog id:", blogId);
        const blogData = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });

        // console.log("blogData", blogData);
        
        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required!",
            });
        }


        if(!updateBlog) return res.status(404).json({
            success: false,
            message: "No Blog found!"
        })

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            updatedBlog
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong", error
        }) 
    }
}

//DELETE a blog
const deleteBlogs = async(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).json({ success: false, message: "No Blog found!"})
        
        await Blog.findByIdAndDelete(blogId);
        return res.status(200).json({
            success: true,
            message: "Blog deleted sucessfully!"
        })    

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong", error
        }) 
    }
}



module.exports = { createBlog, getAllBlogs, updateBlog, deleteBlogs };
