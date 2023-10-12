"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const message_1 = require("../../application/useCases/message");
const messageControllers = (messageDbInterface, messageDbService) => {
    const messageDbRepository = messageDbInterface(messageDbService());
    const createSingleMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId, senderId, receiverId, message, imgURL } = req.body;
        const response = yield (0, message_1.createMessage)(chatId, senderId, receiverId, message, imgURL, messageDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    const createSingleImgMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { chatId, senderId, receiverId, message } = req.body;
        const imgURL = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.split("/chat-")[1];
        const response = yield (0, message_1.createMessage)(chatId, senderId, receiverId, message, imgURL, messageDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    const getChats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const response = yield (0, message_1.getAllChats)(userId, messageDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    const getUserMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = req.params.chatId;
        const response = yield (0, message_1.getMessages)(chatId, messageDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    return {
        createSingleMessage,
        createSingleImgMessage,
        getChats,
        getUserMessages
    };
};
exports.default = messageControllers;
