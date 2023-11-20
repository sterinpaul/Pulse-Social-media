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
const post_1 = require("../../application/useCases/post");
const postControllers = (postDbInterface, postDbService) => {
    const postDbRepository = postDbInterface(postDbService());
    const getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, post_1.getAllPosts)(postDbRepository);
        res.json(response);
    }));
    const addPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const postedUser = req.headers['x-user'];
        const cloudinaryPost = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.split("/upload/")[1];
        let isVideo;
        if ((_d = (_c = req.file) === null || _c === void 0 ? void 0 : _c.mimetype) === null || _d === void 0 ? void 0 : _d.startsWith('video/')) {
            isVideo = true;
        }
        else {
            isVideo = false;
        }
        const postResponse = yield (0, post_1.addNewPost)(postedUser, req.body.description, cloudinaryPost, isVideo, postDbRepository);
        res.json(postResponse);
    }));
    const unlikePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const postId = req.body.postId;
        yield (0, post_1.unlikeThePost)(userName, postId, postDbRepository);
        res.json({ status: true });
    }));
    const likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const postId = req.body.postId;
        yield (0, post_1.likeThePost)(userName, postId, postDbRepository);
        res.json({ status: true });
    }));
    const getPostComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.postId;
        const commentResponse = yield (0, post_1.getComments)(postId, postDbRepository);
        res.json(commentResponse);
    }));
    const addComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentedUser = req.headers['x-user'];
        const { comment, postId, commentId, replyToUser } = req.body;
        const response = yield (0, post_1.addCommentToPost)(comment, commentedUser, postId, commentId, replyToUser, postDbRepository);
        if (response === null || response === void 0 ? void 0 : response.postId) {
            res.json({ comment: true, response });
        }
        else {
            res.json({ comment: false, response });
        }
    }));
    const likeUnlike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const commentId = req.body.commentId;
        yield (0, post_1.likeHandleComment)(userName, commentId, postDbRepository);
        res.json({ status: true });
    }));
    const commentDelete = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentId = req.body.commentId;
        const response = yield (0, post_1.deleteTheComment)(commentId, postDbRepository);
        if (response) {
            res.json({ status: true });
        }
    }));
    const replyLikeUnlike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const commentId = req.body.commentId;
        yield (0, post_1.likeHandleReply)(userName, commentId, postDbRepository);
        res.json({ status: true });
    }));
    const deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        yield (0, post_1.postDelete)(postId, postDbRepository);
        res.json({ status: true });
    }));
    const reportPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userName = req.headers['x-user'];
        const postId = req.body.postId;
        const reason = req.body.selectedReason;
        yield (0, post_1.postReport)(userName, postId, reason, postDbRepository);
        res.json({ status: true });
    }));
    const editThePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.body.postId;
        const description = req.body.description;
        const data = yield (0, post_1.updatePost)(postId, description, postDbRepository);
        res.json({ status: data });
    }));
    return {
        getPost,
        addPost,
        unlikePost,
        likePost,
        getPostComments,
        addComment,
        likeUnlike,
        replyLikeUnlike,
        deletePost,
        commentDelete,
        reportPost,
        editThePost
    };
};
exports.default = postControllers;
