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
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const addedUser = yield repository.addUser(user);
        addedUser.password = "";
        return addedUser;
    });
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getUserByEmail(email);
    });
    const getUserByUsername = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getUserByUserName(userName);
    });
    const getUserByMobile = (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getUserByMobile(mobile);
    });
    const getUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getUserByNameMailMobile(userData);
    });
    const getUserNotifications = (userData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getNotifications(userData);
    });
    const getAllPost = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getPost(userName);
    });
    const postProfilePicture = (userName, profilePic) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.postProfilePicture(userName, profilePic);
    });
    const followUnfollowHandler = (userName, followUser) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.followHandler(userName, followUser);
    });
    const saveThePost = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.postSave(userName, postId);
    });
    const getSavedPosts = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.userSavedPosts(userName);
    });
    const getUserBySearch = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.userSearch(searchText);
    });
    const updateUserName = (userName, newUserName) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.userNameUpdate(userName, newUserName);
    });
    const updateUserProfile = (userName, firstName, lastName, gender, city, bio) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.userProfileUpdate(userName, firstName, lastName, gender, city, bio);
    });
    const removeNotification = (userName, id) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.removeUserNotification(userName, id);
    });
    return {
        addUser,
        getUser,
        getUserByEmail,
        getUserByUsername,
        getUserByMobile,
        getUserNotifications,
        getAllPost,
        postProfilePicture,
        followUnfollowHandler,
        saveThePost,
        getSavedPosts,
        getUserBySearch,
        updateUserName,
        updateUserProfile,
        removeNotification
    };
};
exports.userDbRepository = userDbRepository;
