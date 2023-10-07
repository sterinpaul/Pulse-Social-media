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
exports.messageRepositoryMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const messageRepositoryMongoDB = () => {
    const createMessage = (chatId, senderId, message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newMessage = new messageModel_1.default({
                chatId,
                senderId,
                message
            });
            const response = yield newMessage.save();
            if (response)
                return response;
        }
        catch (error) {
            console.log(error);
        }
    });
    const getAllChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userID = new mongoose_1.default.Types.ObjectId(userId);
            return yield messageModel_1.default.aggregate([
                {
                    $project: {
                        chatId: 1,
                        createdAt: 1
                    }
                },
                {
                    $group: {
                        _id: "$chatId",
                        createdAt: {
                            $last: "$createdAt",
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        chatId: {
                            $toObjectId: "$_id"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "chats",
                        localField: "chatId",
                        foreignField: "_id",
                        as: "result"
                    }
                },
                {
                    $unwind: {
                        path: "$result"
                    }
                },
                {
                    $match: {
                        "result.members": {
                            $in: [
                                userID
                            ]
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$result.members"
                    }
                },
                {
                    $match: {
                        "result.members": {
                            $ne: userID,
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "result.members",
                        foreignField: "_id",
                        as: "result"
                    }
                },
                {
                    $unwind: {
                        path: "$result"
                    }
                },
                {
                    $project: {
                        _id: "$result._id",
                        chatId: 1,
                        userName: "$result.userName",
                        firstName: "$result.firstName",
                        lastName: "$result.lastName",
                        profilePic: "$result.profilePic",
                        createdAt: 1
                    }
                }
            ]);
        }
        catch (error) {
            console.log(error);
        }
    });
    const getMessges = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = yield messageModel_1.default.find({ chatId }).sort({ createdAt: 1 });
            if (messages)
                return messages;
        }
        catch (error) {
            console.log(error);
        }
    });
    return {
        createMessage,
        getAllChats,
        getMessges
    };
};
exports.messageRepositoryMongoDB = messageRepositoryMongoDB;
