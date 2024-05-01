"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
function createUser(firstName, lastName, userName, email, password, mobile) {
    return {
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getUserName: () => userName,
        getEmail: () => email,
        getPassword: () => password,
        getMobile: () => mobile,
    };
}
exports.createUser = createUser;
