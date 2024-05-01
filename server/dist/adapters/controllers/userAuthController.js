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
const userAuth_1 = require("../../application/useCases/auth/userAuth");
const authControllers = (authServiceInterface, authServices, userDbInterface, userDbService) => {
    const userDbRepository = userDbInterface(userDbService());
    const authService = authServiceInterface(authServices());
    const signUpUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, userName, email, password, mobile } = req.body;
        const user = {
            firstName,
            lastName,
            userName,
            email,
            password,
            mobile
        };
        const userData = yield (0, userAuth_1.userSignUp)(user, userDbRepository, authService);
        res.json(userData);
    }));
    const signInUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const userData = yield (0, userAuth_1.userSignIn)(userName, password, userDbRepository, authService);
        // res.setHeader('authorization',userData?.token)
        res.json(userData);
    }));
    const googleSignIn = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.params.email;
        const userDetails = yield (0, userAuth_1.userGoogleSignIn)(email, userDbRepository, authService);
        res.json(userDetails);
    }));
    const googleRegister = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, userName, email, password, mobile } = req.body;
        const user = {
            firstName,
            lastName,
            userName,
            email,
            password,
            mobile
        };
        const userData = yield (0, userAuth_1.userGoogleRegistration)(user, userDbRepository, authService);
        res.json(userData);
    }));
    return {
        signUpUser,
        signInUser,
        googleSignIn,
        googleRegister
    };
};
exports.default = authControllers;
