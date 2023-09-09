import mongoose, { Mongoose } from "mongoose";
import { postDbInterface } from "../repositories/postDbRepository";

interface Post{
    postedUser: string,
    description: string,
    imgVideoURL: string
}

export const getAllPosts = async(
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.getAllPost()
    if(data){
        return data
    }
}

export const addNewPost = async(
    postedUser: string,
    description: string,
    imgVideoURL: string,
    postRepository:ReturnType<postDbInterface>
)=>{
    const post = {
        postedUser,
        description,
        imgVideoURL
    }

    const data = await postRepository.addPost(post)
    if(data){
        return data
    }
}

export const unlikeThePost = async(
    userName:string,
    postId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.unlike(userName,postId)
    if(data){
        return data
    }
}

export const likeThePost = async(
    userName:string,
    postId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.like(userName,postId)
    if(data){
        return data
    }
}

export const getComments = async(
    postId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.getPostComments(new mongoose.Types.ObjectId(postId))
    if(data){
        return data
    }
}

export const addCommentToPost = async(
    comment:string,
    commentedUser:string,
    postId:string,
    commentId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.addCommentToPost(comment,commentedUser,postId,commentId)
    if(data){
        return data
    }
}

export const likeHandleComment = async(
    userName:string,
    commentId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    return await postRepository.likeComment(userName,new mongoose.Types.ObjectId(commentId))
}

export const likeHandleReply = async(
    userName:string,
    commentId:string,
    postRepository:ReturnType<postDbInterface>
)=>{
    return await postRepository.likeReply(userName,commentId)
}

export const postDelete = async(postId:string,postRepository:ReturnType<postDbInterface>)=>{
    return await postRepository.deleteSinglePost(postId)
}

export const postReport = async(userName:string,postId:string,reason:string,postRepository:ReturnType<postDbInterface>)=>{
    return await postRepository.reportThePost(userName,postId,reason)
}