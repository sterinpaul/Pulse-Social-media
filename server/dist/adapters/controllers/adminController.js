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
const admin_1 = require("../../application/useCases/admin");
const adminControllers = (adminDbInterface, adminDbService) => {
    const adminDbRepository = adminDbInterface(adminDbService());
    const getHome = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const profileData = yield (0, admin_1.getUsersAndPostsCount)(adminDbRepository);
        res.json(profileData);
    }));
    const getReportedPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, admin_1.reportedPosts)(adminDbRepository);
        res.json(response);
    }));
    const getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, admin_1.getAllPosts)(adminDbRepository);
        res.json(response);
    }));
    const getUserBySearch = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const searchText = req.query.searchText;
        const userData = yield (0, admin_1.searchUser)(searchText, adminDbRepository);
        res.json(userData);
    }));
    return {
        getHome,
        getReportedPosts,
        getPost,
        getUserBySearch
    };
};
exports.default = adminControllers;
