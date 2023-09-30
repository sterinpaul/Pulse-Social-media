"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const chat_1 = __importDefault(require("./chat"));
const message_1 = __importDefault(require("./message"));
const authMiddlewares_1 = __importDefault(require("../middlewares/authMiddlewares"));
const routes = (app) => {
    app.use('/api/auth', (0, auth_1.default)());
    app.use('/api/user', authMiddlewares_1.default, (0, user_1.default)());
    app.use('/api/post', authMiddlewares_1.default, (0, post_1.default)());
    app.use('/api/chat', authMiddlewares_1.default, (0, chat_1.default)());
    app.use('/api/message', authMiddlewares_1.default, (0, message_1.default)());
};
exports.default = routes;
