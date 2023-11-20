"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../../adapters/controllers/userController"));
const userHelperRepositories_1 = require("../../database/mongoDB/repositories/userHelperRepositories");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const cloudinaryConfig_1 = require("../middlewares/cloudinaryConfig");
const userRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, userController_1.default)(userDbRepository_1.userDbRepository, userHelperRepositories_1.userRepositoryMongoDB);
    router.get('/', controllers.getHome);
    router.get('/getpost', controllers.getPost);
    router.get('/notifications/get', controllers.getnotifications);
    router.get('/:user', controllers.getProfile);
    router.post('/updatephoto', cloudinaryConfig_1.uploadProfilePic, controllers.updateProfilePic);
    router.put('/followunfollow', controllers.followUnfollow);
    router.put('/savepost', controllers.saveThePost);
    router.get('/post/savedposts', controllers.getUserSavedPosts);
    router.get('/search/user', controllers.getUserBySearch);
    router.patch('/updateusername', controllers.updateUserName);
    router.post('/updateprofile', controllers.updateUserData);
    router.patch('/notifications/remove', controllers.removeNotification);
    return router;
};
exports.default = userRouter;
