"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema of Post
const postSchema = new mongoose_1.Schema({
    postedUser: {
        type: String,
        required: true
    },
    listed: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    imgVideoURL: {
        type: String
    },
    isVideo: {
        type: Boolean,
        required: true
    },
    liked: [],
    reports: [],
}, { timestamps: true });
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
