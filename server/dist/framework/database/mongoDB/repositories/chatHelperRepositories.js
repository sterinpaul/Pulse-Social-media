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
exports.chatRepositoryMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const chatRepositoryMongoDB = () => {
    const createChat = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const senderID = new mongoose_1.default.Types.ObjectId(senderId);
            const receiverID = new mongoose_1.default.Types.ObjectId(receiverId);
            const chatExists = yield chatModel_1.default.find({ members: { $all: [senderID, receiverID] } });
            if (chatExists.length) {
                return chatExists;
            }
            else {
                const newChat = new chatModel_1.default({
                    members: [senderID, receiverID]
                });
                const response = yield newChat.save();
                return response;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const getAllChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userID = new mongoose_1.default.Types.ObjectId(userId);
            return yield chatModel_1.default.aggregate([
                {
                    $match: {
                        members: userID
                    }
                },
                {
                    $unwind: {
                        path: "$members",
                    },
                },
                {
                    $match: {
                        members: {
                            $ne: userID,
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "members",
                        foreignField: "_id",
                        as: "result",
                    },
                },
                {
                    $unwind: {
                        path: "$result",
                    },
                },
                {
                    $project: {
                        _id: "$members",
                        chatId: "$_id",
                        userName: "$result.userName",
                        firstName: "$result.firstName",
                        lastName: "$result.lastName",
                        profilePic: "$result.profilePic",
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
            ]);
        }
        catch (error) {
            console.log(error);
        }
    });
    const getSingleChat = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield chatModel_1.default.findOne({ members: { $all: [senderId, receiverId] } });
        }
        catch (error) {
            console.log(error);
        }
    });
    const getMessages = (userId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return [];
        }
        catch (error) {
            console.log(error);
        }
    });
    return {
        createChat,
        getAllChats,
        getSingleChat,
        getMessages
    };
};
exports.chatRepositoryMongoDB = chatRepositoryMongoDB;
