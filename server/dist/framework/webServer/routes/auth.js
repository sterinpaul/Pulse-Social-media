"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthController_1 = __importDefault(require("../../../adapters/controllers/userAuthController"));
const authServices_1 = require("../../services/authServices");
const authServiceInterfaces_1 = require("../../../application/services/authServiceInterfaces");
const userHelperRepositories_1 = require("../../database/mongoDB/repositories/userHelperRepositories");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const authRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, userAuthController_1.default)(authServiceInterfaces_1.authServiceInterface, authServices_1.authServices, userDbRepository_1.userDbRepository, userHelperRepositories_1.userRepositoryMongoDB);
    router.post('/signup', controllers.signUpUser);
    router.post('/signin', controllers.signInUser);
    router.get('/googlesignin/:email', controllers.googleSignIn);
    router.post('/googlereg', controllers.googleRegister);
    return router;
};
exports.default = authRouter;
