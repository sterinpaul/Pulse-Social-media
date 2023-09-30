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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.getAllChats = exports.createMessage = void 0;
const createMessage = (chatId, senderId, message, messageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messageRepository.createSingleMessage(chatId, senderId, message);
});
exports.createMessage = createMessage;
const getAllChats = (userId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield chatRepository.getChats(userId);
    if (data) {
        return data;
    }
});
exports.getAllChats = getAllChats;
const getMessages = (chatId, messageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messageRepository.getAllMessges(chatId);
});
exports.getMessages = getMessages;
