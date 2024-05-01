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
exports.updatePost = exports.postReport = exports.postDelete = exports.likeHandleReply = exports.deleteTheComment = exports.likeHandleComment = exports.addCommentToPost = exports.getComments = exports.likeThePost = exports.unlikeThePost = exports.addNewPost = exports.getAllPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getAllPosts = (postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield postRepository.getAllPost();
    if (data) {
        return data;
    }
});
exports.getAllPosts = getAllPosts;
const addNewPost = (postedUser, description, imgVideoURL, isVideo, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const post = {
        postedUser,
        description,
        imgVideoURL,
        isVideo
    };
    const data = yield postRepository.addPost(post);
    if (data) {
        return data;
    }
});
exports.addNewPost = addNewPost;
const unlikeThePost = (userName, postId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield postRepository.unlike(userName, postId);
    if (data) {
        return data;
    }
});
exports.unlikeThePost = unlikeThePost;
const likeThePost = (userName, postId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield postRepository.like(userName, postId);
    if (data) {
        return data;
    }
});
exports.likeThePost = likeThePost;
const getComments = (postId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield postRepository.getPostComments(new mongoose_1.default.Types.ObjectId(postId));
    if (data) {
        return data;
    }
});
exports.getComments = getComments;
const addCommentToPost = (comment, commentedUser, postId, commentId, replyToUser, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield postRepository.addCommentToPost(comment, commentedUser, postId, commentId, replyToUser);
    if (data) {
        return data;
    }
});
exports.addCommentToPost = addCommentToPost;
const likeHandleComment = (userName, commentId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.likeComment(userName, new mongoose_1.default.Types.ObjectId(commentId));
});
exports.likeHandleComment = likeHandleComment;
const deleteTheComment = (commentId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.commentDelete(commentId);
});
exports.deleteTheComment = deleteTheComment;
const likeHandleReply = (userName, commentId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.likeReply(userName, commentId);
});
exports.likeHandleReply = likeHandleReply;
const postDelete = (postId, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.deleteSinglePost(postId);
});
exports.postDelete = postDelete;
const postReport = (userName, postId, reason, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.reportThePost(userName, postId, reason);
});
exports.postReport = postReport;
const updatePost = (postId, description, postRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.singlePostUpdate(postId, description);
});
exports.updatePost = updatePost;
