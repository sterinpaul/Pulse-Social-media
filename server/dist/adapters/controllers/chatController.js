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
const chat_1 = require("../../application/useCases/chat");
const chatControllers = (chatDbInterface, chatDbService) => {
    const chatDbRepository = chatDbInterface(chatDbService());
    const createNewChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, receiverId } = req.params;
        const response = yield (0, chat_1.createChat)(senderId, receiverId, chatDbRepository);
        if (response) {
            const chatData = {
                status: true,
                data: response
            };
            res.json(chatData);
        }
    }));
    const getSingleUserChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, receiverId } = req.params;
        const response = yield (0, chat_1.getSingleChat)(senderId, receiverId, chatDbRepository);
        res.json(response);
    }));
    const getChats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const response = yield (0, chat_1.getAllChats)(userId, chatDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    const getAllMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, receiverId } = req.params;
        const response = yield (0, chat_1.getAllTheMessages)(userId, receiverId, chatDbRepository);
        if (response) {
            const chatMessageData = {
                status: true,
                data: response
            };
            res.json(chatMessageData);
        }
    }));
    return {
        createNewChat,
        getSingleUserChat,
        getChats,
        getAllMessages
    };
};
exports.default = chatControllers;
