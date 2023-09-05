import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";
import { getAllPosts,followUnfollowUser, getUserProfile,postProfilePic,postSaveHandler,getSavedPosts,searchUser } from "../../application/useCases/user";


const userControllers = (
    userDbInterface:UserDbInterface,
    userDbService:userRepositoryMongoDB
)=>{
    const userDbRepository = userDbInterface(userDbService())

    const getHome = asyncHandler(async(req:Request,res:Response)=>{
        
        const userName = req.headers['x-user'] as string
        const profileData = await getUserProfile(userName,userDbRepository)
        res.json(profileData)
    })

    const getPost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const response = await getAllPosts(userName,userDbRepository)
        res.json(response)
    })
    
    const getProfile = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.params.user
        const profileData = await getUserProfile(userName,userDbRepository)
        res.json(profileData)
    })

    const updateProfilePic = asyncHandler(async(req:Request,res:Response)=>{
        
        if(req.file){
            const userName = req.headers['x-user'] as string
            const cloudinaryImgName = req?.file?.path?.split("/image-")[1] as string
            
            await postProfilePic(userName,cloudinaryImgName,userDbRepository).then(()=>{
                res.status(200).json({ status: 'Success',data: cloudinaryImgName })
            })
        }else{
            res.status(400).json({ status: 'No file uploaded' })
        }
    })

    const followUnfollow = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const followUser = req.body.user
        const response = await followUnfollowUser(userName,followUser,userDbRepository)
        res.json(response)
        
    })

    const saveThePost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const postId = req.body.postId
        await postSaveHandler(userName,postId,userDbRepository)
        res.json({status:true})
    })

    const getUserSavedPosts = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const savedPosts:[] = await getSavedPosts(userName,userDbRepository)
        res.json(savedPosts)
    })

    const getUserBySearch = asyncHandler(async(req:Request,res:Response)=>{
        const searchText = req.body.searchText
        const userData = await searchUser(searchText,userDbRepository)
        res.json(userData)
    })

    return {
        getHome,
        getPost,
        getProfile,
        updateProfilePic,
        followUnfollow,
        saveThePost,
        getUserSavedPosts,
        getUserBySearch
    }
}

export default userControllers