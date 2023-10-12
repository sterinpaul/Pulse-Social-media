"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../../adapters/controllers/adminController"));
const adminHelperRepositories_1 = require("../../database/mongoDB/repositories/adminHelperRepositories");
const adminDbRepository_1 = require("../../../application/repositories/adminDbRepository");
const adminRouter = () => {
    const router = express_1.default.Router();
    const controllers = (0, adminController_1.default)(adminDbRepository_1.adminDbRepository, adminHelperRepositories_1.adminRepositoryMongoDB);
    router.get('/', controllers.getHome);
    router.get('/reports', controllers.getReportedPosts);
    router.get('/getpost', controllers.getPost);
    return router;
};
exports.default = adminRouter;
