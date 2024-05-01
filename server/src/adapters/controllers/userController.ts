import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";
import { 
    getAllPosts,
    followUnfollowUser,
    getUserProfile,
    getNotificationData,
    postProfilePic,
    postSaveHandler,
    getSavedPosts,
    searchUser,
    userNameUpdate,
    userProfileUpdate,
    removeUserNotification
} from "../../application/useCases/user";
import axios from 'axios'


const userControllers = (
    userDbInterface:UserDbInterface,
    userDbService:userRepositoryMongoDB
)=>{
    const userDbRepository = userDbInterface(userDbService())

    const getHome = asyncHandler(async(req:Request,res:Response)=>{

        const ip:any = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
        const fetchedData = await axios.post(`https://ipapi.co/${ip}/json`)

        console.log("IP",ip)
        console.log("fetchedIPData for testing",fetchedData.data)

        const userName = req.headers['x-user'] as string
        const profileData = await getUserProfile(userName,userDbRepository)
        if(profileData){
            res.json(profileData)
        }
    })

    const getPost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const skip = req.params.skip
        const response = await getAllPosts(userName,Number(skip),userDbRepository)
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
        const {followUser} = req.body
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
        const searchText = req.query.searchText
        const userName = req.headers['x-user'] as string
        const userData = await searchUser(searchText as string,userDbRepository)
        res.json(userData.filter((user)=>user.userName!==userName))
    })

    const updateUserName = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const newUserName = req.body.newUserName
        const data = await userNameUpdate(userName,newUserName,userDbRepository)
        res.json({status:data})
    })

    const updateUserData = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const {firstName,lastName,gender,city,bio} = req.body
        const response = await userProfileUpdate(userName,firstName,lastName,gender,city,bio,userDbRepository)
        res.json({status:response})
    })

    const getnotifications = asyncHandler(async(req:Request,res:Response)=>{
        try{
            const userName = req.headers['x-user'] as string
            const notificationData = await getNotificationData(userName,userDbRepository)
            res.json(notificationData)
        }catch(error){
            res.status(400).json(error)
        }
    })

    const removeNotification = asyncHandler(async(req:Request,res:Response)=>{
        try{
            const userName = req.headers['x-user'] as string
            const {id} = req.body
            const response = await removeUserNotification(userName,id,userDbRepository)
            res.json({status:response})
        }catch(error){
            res.status(400).json(error)
        }
    })

    return {
        getHome,
        getPost,
        getProfile,
        updateProfilePic,
        followUnfollow,
        saveThePost,
        getUserSavedPosts,
        getUserBySearch,
        updateUserName,
        updateUserData,
        getnotifications,
        removeNotification
    }
}

export default userControllers