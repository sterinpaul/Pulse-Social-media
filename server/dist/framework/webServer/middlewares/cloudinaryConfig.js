"use strict";
// import {CloudinaryConfiguration} from 'cloudinary-react';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostImgVideo = exports.uploadProfilePic = void 0;
// const cloudinaryConfig:CloudinaryConfiguration = {
//     cloudName:"pulse-socialmedia",
//     apiKey:"615616133356435",
//     apiSecret:"rfWuVkJzxUhlsMJhncX4zUSWWMA",
//     uploadPreset: "ayyzml8c",
//     url:"https://api.cloudinary.com/v1_1/pulse-socialmedia/image/upload"
// }
// export default cloudinaryConfig
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
const profilePicStorage = new multer_storage_cloudinary_1.CloudinaryStorage(profileOptions);
const postStorage = new multer_storage_cloudinary_1.CloudinaryStorage(postImages);
exports.uploadProfilePic = (0, multer_1.default)({ storage: profilePicStorage }).single('profilePic');
exports.uploadPostImgVideo = (0, multer_1.default)({ storage: postStorage }).single('postImgVideo');
