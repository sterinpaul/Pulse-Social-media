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
exports.adminRepositoryMongoDB = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const adminRepositoryMongoDB = () => {
    const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield adminModel_1.default.findOne({ email });
    });
    const getCount = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [totalUsers, totalPosts, usersReport, postsReport] = yield Promise.all([
                userModel_1.default.countDocuments(),
                postModel_1.default.countDocuments({
                    'reports': { $exists: true, $not: { $size: 0 } }
                }),
                userModel_1.default.aggregate([
                    {
                        $match: {
                            isBlocked: false
                        }
                    },
                    {
                        $project: {
                            month: {
                                $month: "$createdAt"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$month",
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            _id: 1
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            month: {
                                $arrayElemAt: [
                                    [
                                        "",
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec",
                                    ],
                                    "$_id"
                                ]
                            },
                            count: 1
                        }
                    }
                ]),
                postModel_1.default.aggregate([
                    {
                        $match: {
                            listed: true,
                        },
                    },
                    {
                        $project: {
                            month: {
                                $month: "$createdAt",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$month",
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            month: {
                                $arrayElemAt: [
                                    [
                                        "",
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec",
                                    ],
                                    "$_id",
                                ],
                            },
                            count: 1,
                        },
                    },
                ])
            ]);
            return { totalUsers, totalPosts, usersReport, postsReport };
        }
        catch (error) {
            console.log('Error fetching data: ', error);
        }
    });
    const allUsers = (status, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        if (status === 'all') {
            const response = yield userModel_1.default.find().sort({ userName: 1 }).skip(pageNumber * 6).limit(6);
            const count = yield userModel_1.default.countDocuments();
            return { count, response };
        }
        else {
            const response = yield userModel_1.default.find({ isBlocked: status }).sort({ userName: 1 }).skip(pageNumber * 6).limit(6);
            const count = yield userModel_1.default.countDocuments({ isBlocked: status });
            return { count, response };
        }
    });
    const getAllReported = (pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield postModel_1.default.find({
            'reports': { $exists: true, $not: { $size: 0 } }
        }).skip(pageNumber * 6).limit(6);
        const count = yield postModel_1.default.countDocuments({
            'reports': { $exists: true, $not: { $size: 0 } }
        });
        return { count, response };
    });
    const postBlockHandler = (postId, status) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield postModel_1.default.updateOne({ _id: postId }, { $set: { listed: !status } });
        if (response.modifiedCount === 1)
            return true;
    });
    const userBlockHandler = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userModel_1.default.updateOne({ _id: userId }, { $set: { isBlocked: !status } });
        if (response.modifiedCount === 1)
            return true;
    });
    const userSearch = (searchText, status, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const regex = new RegExp(searchText, 'i');
        const response = yield userModel_1.default.find({ $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { userName: { $regex: regex } }] }, { userName: 1, profilePic: 1, email: 1, createdAt: 1, isBlocked: 1 }).skip(pageNumber * 6).limit(6);
        const count = yield userModel_1.default.countDocuments({ $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { userName: { $regex: regex } }] });
        return { count, response };
    });
    return {
        getAdminByEmail,
        getCount,
        allUsers,
        getAllReported,
        postBlockHandler,
        userBlockHandler,
        userSearch
    };
};
exports.adminRepositoryMongoDB = adminRepositoryMongoDB;
