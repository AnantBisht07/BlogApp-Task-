const express = require('express');
const { createBlog, getAllBlogs, updateBlog, deleteBlogs } = require('../controllers/blogController');
const { singleUpload } = require("../middlewares/multer");

const router = express.Router();

router.post('/blogs',singleUpload, createBlog);
router.get('/blogs', singleUpload, getAllBlogs);
router.put('/blogs/:blogId', updateBlog);
router.delete('/blogs/:blogId', deleteBlogs);


module.exports = router;
