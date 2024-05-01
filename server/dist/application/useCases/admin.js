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
exports.searchUser = exports.singleUserBlock = exports.singlePostBlock = exports.reportedPosts = exports.allUsers = exports.getUsersAndPostsCount = void 0;
const getUsersAndPostsCount = (adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getAllCount();
    if (data)
        return data;
});
exports.getUsersAndPostsCount = getUsersAndPostsCount;
const allUsers = (status, pageNumber = 0, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getAllUsers(status, pageNumber);
    if (data)
        return data;
});
exports.allUsers = allUsers;
const reportedPosts = (pageNumber, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getReportedPosts(pageNumber);
    if (data)
        return data;
});
exports.reportedPosts = reportedPosts;
const singlePostBlock = (postId, status, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.postBlock(postId, status);
    if (data)
        return data;
});
exports.singlePostBlock = singlePostBlock;
const singleUserBlock = (userId, status, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.userBlock(userId, status);
    if (data)
        return data;
});
exports.singleUserBlock = singleUserBlock;
const searchUser = (searchText, status, pageNumber, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield adminRepository.getUserBySearch(searchText, status, pageNumber);
});
exports.searchUser = searchUser;
