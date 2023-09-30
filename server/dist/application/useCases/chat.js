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
exports.getAllTheMessages = exports.getAllChats = exports.getSingleChat = exports.createChat = void 0;
const createChat = (senderId, receiverId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatRepository.createSingleChat(senderId, receiverId);
});
exports.createChat = createChat;
const getSingleChat = (senderId, receiverId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatRepository.getSingleUserChat(senderId, receiverId);
});
exports.getSingleChat = getSingleChat;
const getAllChats = (userId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield chatRepository.getChats(userId);
    if (data) {
        return data;
    }
});
exports.getAllChats = getAllChats;
const getAllTheMessages = (userId, receiverId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatRepository.getAllMessages(userId, receiverId);
});
exports.getAllTheMessages = getAllTheMessages;
