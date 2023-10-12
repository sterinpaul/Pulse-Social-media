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
exports.searchUser = exports.reportedPosts = exports.getUsersAndPostsCount = exports.getAllPosts = void 0;
const getAllPosts = (adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getAllPost();
    if (data)
        return data;
});
exports.getAllPosts = getAllPosts;
const getUsersAndPostsCount = (adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getAllCount();
    if (data)
        return data;
});
exports.getUsersAndPostsCount = getUsersAndPostsCount;
const reportedPosts = (adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield adminRepository.getReportedPosts();
    if (data)
        return data;
});
exports.reportedPosts = reportedPosts;
const searchUser = (searchText, adminRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield adminRepository.getUserBySearch(searchText);
});
exports.searchUser = searchUser;
