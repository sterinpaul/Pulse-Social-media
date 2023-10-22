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
exports.userRepositoryMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const userRepositoryMongoDB = () => {
    const addUser = (addedUser) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new userModel_1.default(addedUser);
        return yield newUser.save();
    });
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.findOne({ email });
    });
    const getUserByUserName = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        const userProfile = yield userModel_1.default.aggregate([
            {
                $match: {
                    userName
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "userName",
                    foreignField: "postedUser",
                    as: "posts"
                }
            },
            {
                $unwind: {
                    path: "$posts"
                }
            },
            {
                $match: {
                    "posts.listed": true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    firstName: {
                        $first: "$firstName"
                    },
                    lastName: {
                        $first: "$lastName"
                    },
                    userName: {
                        $first: "$userName"
                    },
                    email: {
                        $first: "$email"
                    },
                    profilePic: {
                        $first: "$profilePic"
                    },
                    mobile: {
                        $first: "$mobile"
                    },
                    bio: {
                        $first: "$bio"
                    },
                    city: {
                        $first: "$city"
                    },
                    savedPosts: {
                        $first: "$savedPosts"
                    },
                    blockedUsers: {
                        $first: "$blockedUsers"
                    },
                    blockedByUsers: {
                        $first: "$blockedByUsers"
                    },
                    followers: {
                        $first: "$followers"
                    },
                    following: {
                        $first: "$following"
                    },
                    followRequests: {
                        $first: "$followRequests"
                    },
                    followRequested: {
                        $first: "$followRequested"
                    },
                    createdAt: {
                        $first: "$createdAt"
                    },
                    posts: {
                        $push: "$posts"
                    }
                }
            }
        ]);
        if (userProfile === null || userProfile === void 0 ? void 0 : userProfile.length) {
            return userProfile[0];
        }
        else {
            const user = yield userModel_1.default.findOne({ userName });
            return user;
        }
    });
    const getUserByMobile = (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.findOne({ mobile });
    });
    const getUserByNameMailMobile = (userData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.findOne({ $or: [{ userName: userData }, { email: userData }, { mobile: userData }] });
    });
    const postProfilePicture = (userName, profilePic) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.updateOne({ userName }, { $set: { profilePic } });
    });
    const followHandler = (userName, followUser) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield userModel_1.default.startSession();
        try {
            const followStatus = yield userModel_1.default.findOne({ userName: followUser, followers: { $elemMatch: { $eq: userName } } });
            const operations = [];
            if (followStatus === null) {
                operations.push(userModel_1.default.updateOne({ userName }, { $addToSet: { following: followUser } }), userModel_1.default.updateOne({ userName: followUser }, { $addToSet: { followers: userName } }));
            }
            else {
                operations.push(userModel_1.default.updateOne({ userName }, { $pull: { following: followUser } }), userModel_1.default.updateOne({ userName: followUser }, { $pull: { followers: userName } }));
            }
            const results = yield Promise.allSettled(operations);
            const isSuccess = results.every((result) => result.status === 'fulfilled');
            if (isSuccess) {
                yield session.commitTransaction();
                session.endSession();
                return true;
            }
            else {
                yield session.abortTransaction();
                session.endSession();
                return false;
            }
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            console.log(error);
        }
    });
    const getPost = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        const allPosts = yield userModel_1.default.aggregate([
            {
                $match: {
                    userName
                }
            },
            {
                $project: {
                    following: {
                        $concatArrays: [
                            [userName], "$following"
                        ]
                    },
                    _id: 0
                }
            },
            {
                $unwind: {
                    path: "$following"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "postedUser",
                    as: "result"
                }
            },
            {
                $unwind: {
                    path: "$result"
                }
            },
            {
                $match: {
                    "result.listed": true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
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
                    _id: "$result._id",
                    postedUser: "$result.postedUser",
                    profilePic: "$userData.profilePic",
                    description: "$result.description",
                    listed: "$result.listed",
                    imgVideoURL: "$result.imgVideoURL",
                    liked: "$result.liked",
                    reports: "$result.reports",
                    createdAt: "$result.createdAt",
                    updatedAt: "$result.updatedAt"
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 10
            }
        ]);
        if (allPosts.length) {
            return allPosts;
        }
        else {
            return yield postModel_1.default.aggregate([
                {
                    $match: {
                        listed: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "postedUser",
                        foreignField: "userName",
                        as: "result"
                    }
                },
                {
                    $unwind: {
                        path: "$result"
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        postedUser: "$postedUser",
                        profilePic: "$result.profilePic",
                        description: "$description",
                        listed: "$listed",
                        imgVideoURL: "$imgVideoURL",
                        liked: "$liked",
                        reports: "$reports",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt"
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: 10
                }
            ]);
        }
    });
    const postSave = (userName, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postID = new mongoose_1.default.Types.ObjectId(postId);
            const savedStatus = yield userModel_1.default.findOne({ userName, savedPosts: { $elemMatch: { $eq: postID } } });
            if (savedStatus === null) {
                return yield userModel_1.default.updateOne({ userName }, { $addToSet: { savedPosts: postID } });
            }
            else {
                return yield userModel_1.default.updateOne({ userName }, { $pull: { savedPosts: postID } });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const userSavedPosts = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const savedPosts = yield userModel_1.default.aggregate([
                {
                    $match: {
                        userName
                    }
                },
                {
                    $unwind: {
                        path: "$savedPosts"
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "savedPosts",
                        foreignField: "_id",
                        as: "result"
                    }
                },
                {
                    $unwind: {
                        path: "$result"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "result.postedUser",
                        foreignField: "userName",
                        as: "response"
                    }
                },
                {
                    $unwind: {
                        path: "$response"
                    }
                },
                {
                    $match: {
                        "result.listed": true
                    }
                },
                {
                    $project: {
                        result: {
                            $mergeObjects: [
                                "$result",
                                {
                                    profilePic: "$response.profilePic",
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        savedPosts: {
                            $push: "$result"
                        }
                    }
                }
            ]);
            if (savedPosts) {
                return (_a = savedPosts[0]) === null || _a === void 0 ? void 0 : _a.savedPosts;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const userSearch = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const regex = new RegExp(searchText, 'i');
        return yield userModel_1.default.find({ $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { userName: { $regex: regex } }] }, { firstName: 1, lastName: 1, userName: 1, profilePic: 1, followers: 1 }).limit(10);
    });
    const userNameUpdate = (userName, newUserName) => __awaiter(void 0, void 0, void 0, function* () {
        newUserName = newUserName.toLowerCase();
        const userExist = yield userModel_1.default.findOne({ userName: newUserName });
        if (userExist) {
            return false;
        }
        else {
            const operations = [
                userModel_1.default.updateOne({ userName }, { $set: { userName: newUserName } }),
                postModel_1.default.updateMany({ postedUser: userName }, { $set: { postedUser: newUserName } }),
                commentModel_1.default.updateMany({ commentedUser: userName }, { $set: { commentedUser: newUserName } }),
                commentModel_1.default.updateMany({ "reply": { $elemMatch: { "commentedUser": userName } } }, { $set: { "reply.$[].commentedUser": newUserName } }),
                commentModel_1.default.updateMany({ "reply": { $elemMatch: { "replyToUser": userName } } }, { $set: { "reply.$[].replyToUser": newUserName } })
            ];
            const results = yield Promise.allSettled(operations);
            const isSuccess = results.every((result) => result.status === 'fulfilled');
            if (isSuccess)
                return true;
        }
    });
    const userProfileUpdate = (userName, firstName, lastName, gender, city, bio) => __awaiter(void 0, void 0, void 0, function* () {
        userName = userName.toLowerCase();
        const response = yield userModel_1.default.updateOne({ userName }, { $set: { firstName, lastName, gender, city, bio } });
        if (response.modifiedCount) {
            return true;
        }
        else {
            return false;
        }
    });
    return {
        addUser,
        getUserByEmail,
        getUserByUserName,
        getUserByMobile,
        getUserByNameMailMobile,
        getPost,
        postProfilePicture,
        followHandler,
        postSave,
        userSavedPosts,
        userSearch,
        userNameUpdate,
        userProfileUpdate
    };
};
exports.userRepositoryMongoDB = userRepositoryMongoDB;
