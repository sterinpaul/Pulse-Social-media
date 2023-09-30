"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authServices_1 = require("../../services/authServices");
const userMiddleware = (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    try {
        if (typeof token === "string") {
            const response = (0, authServices_1.authServices)().verifyToken(token);
            if (response) {
                next();
            }
            else {
                res.status(401).json({ message: "Unauthorized" });
            }
        }
    }
    catch (error) {
        res.status(401).json({ message: "Token expired" });
    }
};
exports.default = userMiddleware;
