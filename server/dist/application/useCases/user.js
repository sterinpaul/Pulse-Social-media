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
exports.removeUserNotification = exports.userProfileUpdate = exports.userNameUpdate = exports.searchUser = exports.getSavedPosts = exports.postSaveHandler = exports.followUnfollowUser = exports.postProfilePic = exports.getUserProfile = exports.getNotificationData = exports.getAllPosts = void 0;
const getAllPosts = (userName, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userRepository.getAllPost(userName);
    if (data)
        return data;
});
exports.getAllPosts = getAllPosts;
const getNotificationData = (userName, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.getUserNotifications(userName);
});
exports.getNotificationData = getNotificationData;
const getUserProfile = (userName, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userRepository.getUserByUsername(userName);
    if (data) {
        data.password = '';
        return data;
    }
});
exports.getUserProfile = getUserProfile;
const postProfilePic = (userName, profilePic, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userRepository.postProfilePicture(userName, profilePic);
    if (data) {
        return data;
    }
});
exports.postProfilePic = postProfilePic;
const followUnfollowUser = (userName, followUser, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.followUnfollowHandler(userName, followUser);
});
exports.followUnfollowUser = followUnfollowUser;
const postSaveHandler = (userName, postId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.saveThePost(userName, postId);
});
exports.postSaveHandler = postSaveHandler;
const getSavedPosts = (userName, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.getSavedPosts(userName);
});
exports.getSavedPosts = getSavedPosts;
const searchUser = (searchText, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.getUserBySearch(searchText);
});
exports.searchUser = searchUser;
const userNameUpdate = (userName, newUserName, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.updateUserName(userName, newUserName);
});
exports.userNameUpdate = userNameUpdate;
const userProfileUpdate = (userName, firstName, lastName, gender, city, bio, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepository.updateUserProfile(userName, firstName, lastName, gender, city, bio);
});
exports.userProfileUpdate = userProfileUpdate;
const removeUserNotification = (userName, id, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepository.removeNotification(userName, id);
});
exports.removeUserNotification = removeUserNotification;
