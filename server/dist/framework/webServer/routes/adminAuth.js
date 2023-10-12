"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = __importDefault(require("../../../adapters/controllers/adminAuthController"));
const authServices_1 = require("../../services/authServices");
const authServiceInterfaces_1 = require("../../../application/services/authServiceInterfaces");
const adminHelperRepositories_1 = require("../../database/mongoDB/repositories/adminHelperRepositories");
const adminDbRepository_1 = require("../../../application/repositories/adminDbRepository");
const adminAuthRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, adminAuthController_1.default)(authServiceInterfaces_1.authServiceInterface, authServices_1.authServices, adminDbRepository_1.adminDbRepository, adminHelperRepositories_1.adminRepositoryMongoDB);
    router.post('/adminsignin', controllers.signInAdmin);
    return router;
};
exports.default = adminAuthRouter;
