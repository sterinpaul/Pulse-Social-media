import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { postDbInterface } from "../../application/repositories/postDbRepository";
import { postRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/postHelperRepositories";
import { getAllPosts,
    addNewPost,
    unlikeThePost,
    likeThePost,
    getComments,
    addCommentToPost,
    likeHandleComment,
    likeHandleReply,
    postDelete,
    deleteTheComment,
    postReport,
    updatePost
} from "../../application/useCases/post";


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
        const postedUser = req.headers['x-user'] as string
        const cloudinaryPost = req.file?.path?.split("/post-")[1] as string
        const postResponse = await addNewPost(postedUser,req.body.description,cloudinaryPost,postDbRepository)
        res.json(postResponse)
    })

    const unlikePost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const postId = req.body.postId
        await unlikeThePost(userName,postId,postDbRepository)
        res.json({status:true})
    })

    const likePost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const postId = req.body.postId
        await likeThePost(userName,postId,postDbRepository)
        res.json({status:true})
    })

    const getPostComments = asyncHandler(async(req:Request,res:Response)=>{
        const postId = req.params.postId
        const commentResponse = await getComments(postId,postDbRepository)
        res.json(commentResponse)
    })

    const addComment = asyncHandler(async(req:Request,res:Response)=>{
        const commentedUser = req.headers['x-user'] as string
        const {comment,postId,commentId,replyToUser} = req.body
        console.log(req.body);
        
        const response:any = await addCommentToPost(comment,commentedUser,postId,commentId,replyToUser,postDbRepository)
        if(response?.postId){
            res.json({comment:true,response})
        }else{
            res.json({comment:false,response})
        }
    })

    const likeUnlike = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const commentId = req.body.commentId
        await likeHandleComment(userName,commentId,postDbRepository)
        res.json({status:true})
    })

    const commentDelete = asyncHandler(async(req:Request,res:Response)=>{
        const commentId = req.body.commentId
        const response = await deleteTheComment(commentId,postDbRepository)
        if(response){
            res.json({status:true})
        }
    })

    const replyLikeUnlike = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const commentId = req.body.commentId
        await likeHandleReply(userName,commentId,postDbRepository)
        res.json({status:true})
    })

    const deletePost = asyncHandler(async(req:Request,res:Response)=>{
        const postId = req.params.id
        await postDelete(postId,postDbRepository)
        res.json({status:true})
    })

    const reportPost = asyncHandler(async(req:Request,res:Response)=>{
        const userName = req.headers['x-user'] as string
        const postId = req.body.postId
        const reason = req.body.selectedReason
        await postReport(userName,postId,reason,postDbRepository)
        res.json({status:true})
    })

    const editThePost = asyncHandler(async(req:Request,res:Response)=>{
        const postId = req.body.postId
        const description = req.body.description
        const data = await updatePost(postId,description,postDbRepository)
        res.json({status:data})
    })

    return {
        getPost,
        addPost,
        unlikePost,
        likePost,
        getPostComments,
        addComment,
        likeUnlike,
        replyLikeUnlike,
        deletePost,
        commentDelete,
        reportPost,
        editThePost
    }
}

export default postControllers