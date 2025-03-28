const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, // Reference to the blog
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
