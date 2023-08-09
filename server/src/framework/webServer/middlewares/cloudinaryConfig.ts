// import {CloudinaryConfiguration} from 'cloudinary-react';

// const cloudinaryConfig:CloudinaryConfiguration = {
//     cloudName:"pulse-socialmedia",
//     apiKey:"615616133356435",
//     apiSecret:"rfWuVkJzxUhlsMJhncX4zUSWWMA",
//     uploadPreset: "ayyzml8c",
//     url:"https://api.cloudinary.com/v1_1/pulse-socialmedia/image/upload"
// }

// export default cloudinaryConfig


import multer from 'multer';
import {CloudinaryStorage } from 'multer-storage-cloudinary';
import {v2 as cloudinary} from 'cloudinary';
          

const options = {
    cloudinary:cloudinary,
    params:{
        folder: 'profilePics',
        allowed_formats : ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'jfif', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] ,
        public_id: (req:any,file:any) => {
            const originalname = file.originalname.split('.')
            return `image-${Date.now()}-${originalname[0]}`
        }
    }
}
const profilePicStorage = new CloudinaryStorage(options)
export const uploadProfilePic = multer({storage:profilePicStorage }).single('profilePic')
