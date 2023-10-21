import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { AdminDbInterface } from "../../application/repositories/adminDbRepository";
import { adminRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/adminHelperRepositories";
import { 
    getUsersAndPostsCount,
    allUsers,
    reportedPosts,
    singlePostBlock,
    singleUserBlock,
    searchUser
} from "../../application/useCases/admin";


const adminControllers = (
    adminDbInterface:AdminDbInterface,
    adminDbService:adminRepositoryMongoDB
)=>{
    const adminDbRepository = adminDbInterface(adminDbService())

    const getHome = asyncHandler(async(req:Request,res:Response)=>{
        const profileData = await getUsersAndPostsCount(adminDbRepository)
        res.json(profileData)
    })

    const getAllUsers = asyncHandler(async(req:Request,res:Response)=>{
        const {status,pageNumber} = req.params
        const response = await allUsers(status,Number(pageNumber),adminDbRepository)
        res.json(response)
    })

    const getReportedPosts = asyncHandler(async(req:Request,res:Response)=>{
        const {pageNumber} = req.query
        const response = await reportedPosts(Number(pageNumber),adminDbRepository)
        res.json(response)
    })

    const postBlockhandler = asyncHandler(async(req:Request,res:Response)=>{
        const {postId,status} = req.body
        const response = await singlePostBlock(postId,status,adminDbRepository)
        res.json(response)
    })

    const userBlockhandler = asyncHandler(async(req:Request,res:Response)=>{
        const {userId,status} = req.body
        const response = await singleUserBlock(userId,status,adminDbRepository)
        res.json(response)
    })

    const getUserBySearch = asyncHandler(async(req:Request,res:Response)=>{
        const {searchText,status,pageNumber} = req.query
        const userData = await searchUser(searchText as string,status as string,Number(pageNumber),adminDbRepository)
        res.json(userData)
    })


    return {
        getHome,
        getAllUsers,
        getReportedPosts,
        postBlockhandler,
        userBlockhandler,
        getUserBySearch
    }
}

export default adminControllers