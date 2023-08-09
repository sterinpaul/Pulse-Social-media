import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";
import { getUserProfile,postProfilePic } from "../../application/useCases/user";


const userControllers = (
    userDbInterface:UserDbInterface,
    userDbService:userRepositoryMongoDB
)=>{
    const userDbRepository = userDbInterface(userDbService())
    const getProfile = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.params.user
        const profileData = await getUserProfile(userName,userDbRepository)
        res.json(profileData)
    })

    const updateProfilePic = asyncHandler(async(req:Request,res:Response)=>{
        
        if(req.file){
            const userName = req.body.userName
            const userId = req.params._id
            console.log('userId in userControllers',userId)
            
            const cloudinaryImgName = req?.file?.path?.split("/image-")[1]
            await postProfilePic(userName,cloudinaryImgName,userDbRepository).then(()=>{
                res.status(200).json({ status: 'Success',data: cloudinaryImgName })
            })
        }else{
            res.status(400).json({ status: 'No file uploaded' })
        }
    })

    return {
        getProfile,
        updateProfilePic
    }
}

export default userControllers