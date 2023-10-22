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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGoogleRegistration = exports.userGoogleSignIn = exports.userSignIn = exports.userSignUp = void 0;
// import { createUser } from "../../../entity/userEntity"
const userSignUp = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    user.email = user.email.toLowerCase();
    user.userName = user.userName.toLowerCase();
    const isEmailExist = yield userRepository.getUserByEmail(user.email);
    if (isEmailExist) {
        const userData = {
            status: "failed",
            message: "Email already exists",
            user: {},
            token: ''
        };
        return userData;
    }
    const isUserNameExist = yield userRepository.getUserByUsername(user.userName);
    if (isUserNameExist) {
        const userData = {
            status: "failed",
            message: "Username already exists",
            user: {},
            token: ''
        };
        return userData;
    }
    let encryptPassword = yield authService.encryptPassword(user.password);
    user.password = encryptPassword;
    // const UserEntity = createUser(...user)
    const data = yield userRepository.addUser(user);
    const jwtToken = yield authService.generateToken((_a = data._id) === null || _a === void 0 ? void 0 : _a.toString());
    const userData = {
        status: "success",
        message: "Registration Success",
        user: data,
        token: jwtToken
    };
    return userData;
});
exports.userSignUp = userSignUp;
const userSignIn = (userName, password, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    userName = userName.toLowerCase();
    const data = yield userRepository.getUser(userName);
    if (!data) {
        const userData = {
            status: "failed",
            message: "User does not exist",
            user: {},
            token: ''
        };
        return userData;
    }
    if (data === null || data === void 0 ? void 0 : data.isBlocked) {
        const userData = {
            status: "failed",
            message: "User is blocked",
            user: {},
            token: ''
        };
        return userData;
    }
    const isPassword = yield authService.comparePassword(password, data === null || data === void 0 ? void 0 : data.password);
    if (!isPassword) {
        const userData = {
            status: "failed",
            message: "Password incorrect",
            user: {},
            token: ''
        };
        return userData;
    }
    const jwtToken = yield authService.generateToken((_b = data === null || data === void 0 ? void 0 : data._id) === null || _b === void 0 ? void 0 : _b.toString());
    data.password = '';
    const userData = {
        status: "success",
        message: "Sign in Success",
        user: data,
        token: jwtToken
    };
    return userData;
});
exports.userSignIn = userSignIn;
const userGoogleSignIn = (email, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userByEmail = yield userRepository.getUserByEmail(email);
    if (userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.isBlocked) {
        const userData = {
            status: "blocked",
            message: "User is blocked"
        };
        return userData;
    }
    if ((userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.isBlocked) === false) {
        const jwtToken = yield authService.generateToken((_c = userByEmail._id) === null || _c === void 0 ? void 0 : _c.toString());
        userByEmail.password = '';
        const userData = {
            status: "success",
            message: "Sign in Success",
            user: userByEmail,
            token: jwtToken
        };
        return userData;
    }
    else {
        const userData = {
            status: "failed",
            message: "Add User name to proceed"
        };
        return userData;
    }
});
exports.userGoogleSignIn = userGoogleSignIn;
const userGoogleRegistration = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const isUserNameExist = yield userRepository.getUserByUsername(user.userName);
    if (isUserNameExist) {
        const userData = {
            status: "failed",
            message: "Username already exists"
        };
        return userData;
    }
    const data = yield userRepository.addUser(user);
    const jwtToken = yield authService.generateToken((_d = data._id) === null || _d === void 0 ? void 0 : _d.toString());
    const userData = {
        status: "success",
        message: "Sign in Success",
        user: data,
        token: jwtToken
    };
    return userData;
});
exports.userGoogleRegistration = userGoogleRegistration;
