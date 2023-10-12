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
exports.adminSignIn = void 0;
const adminSignIn = (email, password, adminRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield adminRepository.getAdminByEmail(email);
    if (!data) {
        const adminData = {
            status: "failed",
            message: "Admin does not exist",
            // user:{},
            // token:''
        };
        return adminData;
    }
    const isPassword = yield authService.comparePassword(password, data === null || data === void 0 ? void 0 : data.password);
    if (!isPassword) {
        const adminData = {
            status: "failed",
            message: "Password incorrect",
            // admin:{},
            // token:''
        };
        return adminData;
    }
    const jwtToken = yield authService.generateToken((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
    data.password = '';
    const adminData = {
        status: "success",
        message: "Sign in Success",
        admin: data,
        token: jwtToken
    };
    return adminData;
});
exports.adminSignIn = adminSignIn;
