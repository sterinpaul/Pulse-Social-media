"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema of User
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    profilePic: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        required: false
    },
    bio: {
        type: String
    },
    gender: {
        type: String
    },
    city: {
        type: String
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    savedPosts: [],
    blockedUsers: [],
    blockedByUsers: [],
    followers: [],
    following: [],
    followRequests: [],
    followRequested: [],
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
