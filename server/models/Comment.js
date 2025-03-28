const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blog: 
    { 
        type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true
    },
    user: 
    { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    }, 
    text: 
    { 
        type: String, required: true 
    },
    createdAt: 
    { 
        type: Date, default: Date.now 
    },
    parentComment: 
    { 
        type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null 
    }, 
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
