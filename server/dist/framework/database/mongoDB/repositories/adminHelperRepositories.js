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
    const getPost = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.find();
    });
    const getCount = () => __awaiter(void 0, void 0, void 0, function* () {
        const totalUsers = yield userModel_1.default.find({ isBlocked: false }).count();
        const totalPosts = yield postModel_1.default.find({ listed: true }).count();
        return { totalUsers, totalPosts };
    });
    const getAllReported = () => __awaiter(void 0, void 0, void 0, function* () {
        const allReportedPosts = yield userModel_1.default.find({ isBlocked: false }).count();
        console.log(allReportedPosts);
        return allReportedPosts;
    });
    const userSearch = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const regex = new RegExp(searchText, 'i');
        return yield userModel_1.default.find({ $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { userName: { $regex: regex } }] }, { firstName: 1, lastName: 1, userName: 1, profilePic: 1, followers: 1 }).limit(10);
    });
    return {
        getAdminByEmail,
        getCount,
        getAllReported,
        getPost,
        userSearch
    };
};
exports.adminRepositoryMongoDB = adminRepositoryMongoDB;
