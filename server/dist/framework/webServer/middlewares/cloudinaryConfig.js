"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadChatImg = exports.uploadPostImgVideo = exports.uploadProfilePic = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const profileOptions = {
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'profilePics',
        allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'jfif', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] ,
        public_id: (req, file) => {
            const originalname = file.originalname.split('.');
            return `image-${Date.now()}-${originalname[0]}`;
        }
    }
};
const profilePicStorage = new multer_storage_cloudinary_1.CloudinaryStorage(profileOptions);
exports.uploadProfilePic = (0, multer_1.default)({ storage: profilePicStorage }).single('profilePic');
const postImages = {
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'postImgVideo',
        allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'jfif', 'webp', 'gif', 'mp4', 'mpeg'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] ,
        public_id: (req, file) => {
            const originalname = file.originalname.split('.');
            return `post-${Date.now()}-${originalname[0]}`;
        }
    }
};
const postStorage = new multer_storage_cloudinary_1.CloudinaryStorage(postImages);
exports.uploadPostImgVideo = (0, multer_1.default)({ storage: postStorage }).single('postImgVideo');
const chatImages = {
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'chatImg',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'jfif', 'webp', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }, { quality: '60' }],
        public_id: (req, file) => {
            const originalname = file.originalname.split('.');
            return `chat-${Date.now()}-${originalname[0]}`;
        }
    }
};
const chatStorage = new multer_storage_cloudinary_1.CloudinaryStorage(chatImages);
exports.uploadChatImg = (0, multer_1.default)({ storage: chatStorage }).single('imgChat');
