import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { AdminDbInterface } from "../../application/repositories/adminDbRepository";
import { adminRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/adminHelperRepositories";
import { 
    getUsersAndPostsCount,
    reportedPosts,
    getAllPosts,
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

    const getReportedPosts = asyncHandler(async(req:Request,res:Response)=>{
        const response = await reportedPosts(adminDbRepository)
        res.json(response)
    })

    const getPost = asyncHandler(async(req:Request,res:Response)=>{
        const response = await getAllPosts(adminDbRepository)
        res.json(response)
    })


    const getUserBySearch = asyncHandler(async(req:Request,res:Response)=>{
        const searchText = req.query.searchText
        const userData = await searchUser(searchText as string,adminDbRepository)
        res.json(userData)
    })



    return {
        getHome,
        getReportedPosts,
        getPost,
        getUserBySearch
    }
}

export default adminControllers