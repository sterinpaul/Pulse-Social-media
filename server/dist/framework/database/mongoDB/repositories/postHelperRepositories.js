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
exports.postRepositoryMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postRepositoryMongoDB = () => {
    const getPost = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield postModel_1.default.aggregate([
            {
                $match: {
                    listed: true
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedUser",
                    foreignField: "userName",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$userData"
                }
            },
            {
                $project: {
                    postedUser: 1,
                    description: 1,
                    imgVideoURL: 1,
                    isVideo: 1,
                    profilePic: "$userData.profilePic",
                    liked: 1,
                    createdAt: 1
                }
            }
        ]);
    });
    const addPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const newPost = new postModel_1.default(post);
        return yield newPost.save();
    });
    const unlikePost = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $pull: { liked: userName } });
    });
    const likePost = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $addToSet: { liked: userName } });
    });
    const getComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        const commentWithoutReply = yield commentModel_1.default.aggregate([
            {
                $match: {
                    postId,
                    listed: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "commentedUser",
                    foreignField: "userName",
                    as: "userData",
                },
            },
            {
                $unwind: {
                    path: "$userData",
                },
            },
            {
                $project: {
                    comment: 1,
                    commentedUser: 1,
                    profilePic: "$userData.profilePic",
                    liked: 1,
                    reply: 1,
                    createdAt: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        if (commentWithoutReply.some((obj) => obj.reply.length)) {
            return yield commentModel_1.default.aggregate([
                {
                    $match: {
                        postId,
                        listed: true
                    }
                },
                {
                    $unwind: {
                        path: "$reply"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "commentedUser",
                        foreignField: "userName",
                        as: "userData"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "reply.commentedUser",
                        foreignField: "userName",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$userData"
                    }
                },
                {
                    $unwind: {
                        path: "$user"
                    }
                },
                {
                    $project: {
                        comment: 1,
                        commentedUser: 1,
                        profilePic: "$userData.profilePic",
                        liked: 1,
                        reply: {
                            _id: "$reply._id",
                            comment: "$reply.comment",
                            commentedUser: "$reply.commentedUser",
                            liked: "$reply.liked",
                            profilePic: "$user.profilePic",
                            createdAt: "$reply.createdAt",
                        },
                        createdAt: 1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        comment: {
                            $first: "$comment"
                        },
                        commentedUser: {
                            $first: "$commentedUser"
                        },
                        profilePic: {
                            $first: "$profilePic"
                        },
                        liked: {
                            $first: "$liked"
                        },
                        createdAt: {
                            $first: "$createdAt"
                        },
                        reply: {
                            $push: "$reply"
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);
        }
        else {
            return commentWithoutReply;
        }
    });
    const addComment = (comment, commentedUser, postId, commentId, replyToUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (commentId.length) {
            const comments = comment.replace(`@${replyToUser}`, '');
            const replyData = {
                _id: new mongoose_1.default.Types.ObjectId(),
                comment: comments,
                commentedUser,
                replyToUser,
                liked: [],
                listed: true,
                createdAt: new Date()
            };
            const reply = yield commentModel_1.default.updateOne({ _id: commentId }, { $push: { reply: replyData } });
            if (reply) {
                return replyData;
            }
        }
        else {
            const commentData = {
                comment,
                commentedUser,
                postId
            };
            const newComment = new commentModel_1.default(commentData);
            return yield newComment.save();
        }
    });
    const commentLikeUnlike = (userName, commentId) => __awaiter(void 0, void 0, void 0, function* () {
        const likeStatus = yield commentModel_1.default.findOne({ _id: commentId, liked: { $elemMatch: { $eq: userName } } });
        if (likeStatus === null) {
            return yield commentModel_1.default.updateOne({ _id: commentId }, { $addToSet: { liked: userName } });
        }
        else {
            return yield commentModel_1.default.updateOne({ _id: commentId }, { $pull: { liked: userName } });
        }
    });
    const deleteTheComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield commentModel_1.default.updateOne({ _id: commentId }, { $set: { listed: false } });
            if (response.modifiedCount === 1)
                return true;
        }
        catch (error) {
            console.log(error);
        }
    });
    const replyLikeUnlike = (userName, commentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const commentID = new mongoose_1.default.Types.ObjectId(commentId);
            const likeStatus = yield commentModel_1.default.findOne({ _id: commentID, "reply.liked": { $elemMatch: { $eq: userName } } });
            if (likeStatus === null) {
                return yield commentModel_1.default.updateOne({ _id: commentID }, { $addToSet: { "reply.liked": userName } });
            }
            else {
                return yield commentModel_1.default.updateOne({ _id: commentID }, { $pull: { "reply.liked": userName } });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const postDelete = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postID = new mongoose_1.default.Types.ObjectId(postId);
            const operations = [];
            operations.push(commentModel_1.default.updateMany({ postId: postID }, { $set: { listed: false } }), postModel_1.default.updateOne({ _id: postID }, { $set: { listed: false } }), userModel_1.default.updateMany({ savedPosts: postID }, { $pull: { savedPosts: postID } }));
            const results = yield Promise.allSettled(operations);
            const isSuccess = results.every((result) => result.status === 'fulfilled');
            if (isSuccess)
                return true;
        }
        catch (error) {
            console.log(error);
        }
    });
    const postReport = (userName, postId, reason) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postID = new mongoose_1.default.Types.ObjectId(postId);
            const data = {
                userName, reason
            };
            return yield postModel_1.default.updateOne({ _id: postID }, { $addToSet: { reports: data } });
        }
        catch (error) {
            console.log(error);
        }
    });
    const updateThePost = (postId, description) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postID = new mongoose_1.default.Types.ObjectId(postId);
            const updatedPost = yield postModel_1.default.updateOne({ _id: postID }, { $set: { description } });
            if (updatedPost.modifiedCount === 1)
                return true;
        }
        catch (error) {
            console.log(error);
        }
    });
    return {
        getPost,
        addPost,
        unlikePost,
        likePost,
        getComments,
        addComment,
        commentLikeUnlike,
        deleteTheComment,
        replyLikeUnlike,
        postDelete,
        postReport,
        updateThePost
    };
};
exports.postRepositoryMongoDB = postRepositoryMongoDB;
