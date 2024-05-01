"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postModel_1 = __importDefault(require("./postModel"));
const commentSchema = new mongoose_1.Schema({
    commentedUser: {
        type: String,
        required: true
    },
    listed: {
        type: Boolean,
        default: true
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: postModel_1.default,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reports: [],
    liked: [],
    reply: []
}, { timestamps: true });
const Comment = (0, mongoose_1.model)("Comments", commentSchema);
exports.default = Comment;
