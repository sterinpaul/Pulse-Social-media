"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../../../adapters/controllers/chatController"));
const chatHelperRepositories_1 = require("../../database/mongoDB/repositories/chatHelperRepositories");
const chatDbRepository_1 = require("../../../application/repositories/chatDbRepository");
const chatRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, chatController_1.default)(chatDbRepository_1.chatDbRepository, chatHelperRepositories_1.chatRepositoryMongoDB);
    router.post('/:senderId/:receiverId', controllers.createNewChat);
    // router.get('/:senderId/:receiverId',controllers.getSingleUserChat)
    router.get('/:userId', controllers.getChats);
    router.get('/:userId/:receiverId', controllers.getAllMessages);
    return router;
};
exports.default = chatRouter;
