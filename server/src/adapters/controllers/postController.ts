import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { postDbInterface } from "../../application/repositories/postDbRepository";
import { postRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/postHelperRepositories";
import { getAllPosts,addNewPost } from "../../application/useCases/post";

const postControllers = (
    postDbInterface:postDbInterface,
    postDbService:postRepositoryMongoDB
)=>{
    const postDbRepository = postDbInterface(postDbService())

    const getPost = asyncHandler(async(req:Request,res:Response)=>{
        const response = await getAllPosts(postDbRepository)
        res.json(response)
    })

    const addPost = asyncHandler(async(req:Request,res:Response)=>{
        const postResponse = await addNewPost(req.body,postDbRepository)
        res.json(postResponse)
    })

    return {
        getPost,
        addPost
    }
}

export default postControllers