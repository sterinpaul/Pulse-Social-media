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
const adminAuth_1 = require("../../application/useCases/auth/adminAuth");
const adminAuthControllers = (authServiceInterface, authServices, adminDbInterface, adminDbService) => {
    const adminDbRepository = adminDbInterface(adminDbService());
    const authService = authServiceInterface(authServices());
    const signInAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { adminEmail, password } = req.body;
        const userData = yield (0, adminAuth_1.adminSignIn)(adminEmail, password, adminDbRepository, authService);
        res.json(userData);
    }));
    return {
        signInAdmin
    };
};
exports.default = adminAuthControllers;
