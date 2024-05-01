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
const user_1 = require("../../application/useCases/user");
const axios_1 = __importDefault(require("axios"));
const userControllers = (userDbInterface, userDbService) => {
    const userDbRepository = userDbInterface(userDbService());
    const getHome = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const fetchedData = yield axios_1.default.post(`https://ipapi.co/${req.ip}/json`);
        const jsonData = fetchedData.data;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const newIpConf = req.headers['x-real-ip'];
        console.log("newIpConf for testing", newIpConf);
        console.log("ip", ip);
        console.log("fetched jsonData", jsonData);
        const userName = req.headers['x-user'];
        const profileData = yield (0, user_1.getUserProfile)(userName, userDbRepository);
        if (profileData) {
            res.json(profileData);
        }
    }));
    const getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const skip = req.params.skip;
        const response = yield (0, user_1.getAllPosts)(userName, Number(skip), userDbRepository);
        res.json(response);
    }));
    const getProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.params.user;
        const profileData = yield (0, user_1.getUserProfile)(userName, userDbRepository);
        res.json(profileData);
    }));
    const updateProfilePic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (req.file) {
            const userName = req.headers['x-user'];
            const cloudinaryImgName = (_b = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.split("/image-")[1];
            yield (0, user_1.postProfilePic)(userName, cloudinaryImgName, userDbRepository).then(() => {
                res.status(200).json({ status: 'Success', data: cloudinaryImgName });
            });
        }
        else {
            res.status(400).json({ status: 'No file uploaded' });
        }
    }));
    const followUnfollow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const { followUser } = req.body;
        const response = yield (0, user_1.followUnfollowUser)(userName, followUser, userDbRepository);
        res.json(response);
    }));
    const saveThePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const postId = req.body.postId;
        yield (0, user_1.postSaveHandler)(userName, postId, userDbRepository);
        res.json({ status: true });
    }));
    const getUserSavedPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const savedPosts = yield (0, user_1.getSavedPosts)(userName, userDbRepository);
        res.json(savedPosts);
    }));
    const getUserBySearch = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const searchText = req.query.searchText;
        const userName = req.headers['x-user'];
        const userData = yield (0, user_1.searchUser)(searchText, userDbRepository);
        res.json(userData.filter((user) => user.userName !== userName));
    }));
    const updateUserName = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const newUserName = req.body.newUserName;
        const data = yield (0, user_1.userNameUpdate)(userName, newUserName, userDbRepository);
        res.json({ status: data });
    }));
    const updateUserData = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const { firstName, lastName, gender, city, bio } = req.body;
        const response = yield (0, user_1.userProfileUpdate)(userName, firstName, lastName, gender, city, bio, userDbRepository);
        res.json({ status: response });
    }));
    const getnotifications = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userName = req.headers['x-user'];
            const notificationData = yield (0, user_1.getNotificationData)(userName, userDbRepository);
            res.json(notificationData);
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    const removeNotification = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userName = req.headers['x-user'];
            const { id } = req.body;
            const response = yield (0, user_1.removeUserNotification)(userName, id, userDbRepository);
            res.json({ status: response });
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    return {
        getHome,
        getPost,
        getProfile,
        updateProfilePic,
        followUnfollow,
        saveThePost,
        getUserSavedPosts,
        getUserBySearch,
        updateUserName,
        updateUserData,
        getnotifications,
        removeNotification
    };
};
exports.default = userControllers;
