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
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const authServices = () => {
    const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        return hashedPassword;
    });
    const comparePassword = (password, hashedPassword) => {
        return bcryptjs_1.default.compare(password, hashedPassword);
    };
    const generateToken = (payload) => {
        if (config_1.configKeys.JWT_SECRET_KEY) {
            const token = jsonwebtoken_1.default.sign({ payload }, config_1.configKeys.JWT_SECRET_KEY, {
                expiresIn: "2d"
            });
            return token;
        }
        else {
            throw new Error("JWT Token is undefined");
        }
    };
    const verifyToken = (token) => {
        if (config_1.configKeys.JWT_SECRET_KEY) {
            const userData = jsonwebtoken_1.default.verify(token, config_1.configKeys.JWT_SECRET_KEY);
            if (userData.exp !== undefined) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                if (userData.exp >= currentTimeInSeconds) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return undefined;
    };
    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken
    };
};
exports.authServices = authServices;
