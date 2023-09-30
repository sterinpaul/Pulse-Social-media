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
exports.postDbRepository = void 0;
const postDbRepository = (repository) => {
    const getAllPost = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getPost();
    });
    const addPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.addPost(post);
    });
    const unlike = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.unlikePost(userName, postId);
    });
    const like = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.likePost(userName, postId);
    });
    const getPostComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getComments(postId);
    });
    const addCommentToPost = (comment, commentedUser, postId, commentId, replyToUser) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.addComment(comment, commentedUser, postId, commentId, replyToUser);
    });
    const likeComment = (userName, commentId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.commentLikeUnlike(userName, commentId);
    });
    const likeReply = (userNmae, commentId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.replyLikeUnlike(userNmae, commentId);
    });
    const deleteSinglePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.postDelete(postId);
    });
    const commentDelete = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.deleteTheComment(commentId);
    });
    const reportThePost = (userName, postId, reason) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.postReport(userName, postId, reason);
    });
    const singlePostUpdate = (postId, description) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.updateThePost(postId, description);
    });
    return {
        getAllPost,
        addPost,
        unlike,
        like,
        getPostComments,
        addCommentToPost,
        likeComment,
        likeReply,
        deleteSinglePost,
        commentDelete,
        reportThePost,
        singlePostUpdate
    };
};
exports.postDbRepository = postDbRepository;
