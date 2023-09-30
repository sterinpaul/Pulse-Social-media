"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../../../adapters/controllers/messageController"));
const messageHelperRepositories_1 = require("../../database/mongoDB/repositories/messageHelperRepositories");
const messageDbRepository_1 = require("../../../application/repositories/messageDbRepository");
const messageRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, messageController_1.default)(messageDbRepository_1.messageDbRepository, messageHelperRepositories_1.messageRepositoryMongoDB);
    router.post('/', controllers.createSingleMessage);
    router.get('/:chatId', controllers.getUserMessages);
    router.get('/chat/:userId', controllers.getChats);
    return router;
};
exports.default = messageRouter;
