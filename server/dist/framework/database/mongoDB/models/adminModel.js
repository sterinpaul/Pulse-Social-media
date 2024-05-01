"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema of User
const adminSchema = new mongoose_1.Schema({
    adminName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    }
}, { timestamps: true });
const Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = Admin;
