import mongoose from "mongoose";
import { postRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/postHelperRepositories";

export const postDbRepository = (repository:ReturnType<postRepositoryMongoDB>)=>{

    const getAllPost = async()=>{
        return await repository.getPost()
    }

    const addPost = async(post:{
        postedUser: string,
        description: string,
        imgVideoURL: string
    })=>{
        return await repository.addPost(post)
    }

    const unlike = async(userName:string,postId:string)=>{
        return await repository.unlikePost(userName,postId)
    }

    const like = async(userName:string,postId:string)=>{
        return await repository.likePost(userName,postId)
    }

    const getPostComments = async(postId:mongoose.Types.ObjectId)=>{
        return await repository.getComments(postId)
    }

    const addCommentToPost = async(
        comment:string,
        commentedUser:string,
        postId:string,
        commentId:string
    )=>{
        return await repository.addComment(comment,commentedUser,postId,commentId)
    }

    const likeComment = async(userName:string,commentId:mongoose.Types.ObjectId)=>{
        return await repository.commentLikeUnlike(userName,commentId)
    }

    const likeReply = async(userNmae:string,commentId:string)=>{
        return await repository.replyLikeUnlike(userNmae,commentId)
    }

    const deleteSinglePost = async(postId:string)=>{
        return await repository.postDelete(postId)
    }

    const reportThePost = async(userName:string,postId:string)=>{
        return await repository.postReport(userName,postId)
    }

    return {
        getAllPost,
        addPost,
        unlike,
        like,
        getPostComments,
        addCommentToPost,
        likeComment,
        likeReply,
        deleteSinglePost,
        reportThePost
    }
}
export type postDbInterface = typeof postDbRepository

