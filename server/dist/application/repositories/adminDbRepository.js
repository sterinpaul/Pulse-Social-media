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
exports.adminDbRepository = void 0;
const adminDbRepository = (repository) => {
    const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getAdminByEmail(email);
    });
    const getAllCount = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getCount();
    });
    const getAllUsers = (status, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.allUsers(status, pageNumber);
    });
    const getReportedPosts = (pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getAllReported(pageNumber);
    });
    const postBlock = (postId, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.postBlockHandler(postId, status);
    });
    const userBlock = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.userBlockHandler(userId, status);
    });
    const getUserBySearch = (searchText, status, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.userSearch(searchText, status, pageNumber);
    });
    return {
        getAdminByEmail,
        getAllCount,
        getAllUsers,
        getReportedPosts,
        postBlock,
        userBlock,
        getUserBySearch
    };
};
exports.adminDbRepository = adminDbRepository;
