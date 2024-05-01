"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../../../adapters/controllers/postController"));
const postHelperRepositories_1 = require("../../database/mongoDB/repositories/postHelperRepositories");
const postDbRepository_1 = require("../../../application/repositories/postDbRepository");
const cloudinaryConfig_1 = require("../middlewares/cloudinaryConfig");
const postRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, postController_1.default)(postDbRepository_1.postDbRepository, postHelperRepositories_1.postRepositoryMongoDB);
    router.get('/getpost', controllers.getPost);
    router.post('/addpost', cloudinaryConfig_1.uploadPostImgVideo, controllers.addPost);
    router.put('/unlike', controllers.unlikePost);
    router.put('/like', controllers.likePost);
    router.get('/comment/:postId', controllers.getPostComments);
    router.post('/addcomment', controllers.addComment);
    router.put('/comment/likeunlike', controllers.likeUnlike);
    router.put('/reply/likeunlike', controllers.likeUnlike);
    router.patch('/delete/:id', controllers.deletePost);
    router.patch('/comment/delete', controllers.commentDelete);
    router.put('/report', controllers.reportPost);
    router.patch('/editpost', controllers.editThePost);
    return router;
};
exports.default = postRouter;
