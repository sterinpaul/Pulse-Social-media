import mongoose from "mongoose"
import Comment from "../models/commentModel"
import Post from "../models/postModel"
import User from "../models/userModel"


interface postInterface{
    postedUser: string,
    description: string,
    imgVideoURL: string
}

export const postRepositoryMongoDB = ()=>{

    const getPost = async()=>{
        return await Post.aggregate([
            {
              $match: {
                isBlocked: false,
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "postedUser",
                foreignField: "userName",
                as: "userData"
              }
            },
            {
              $unwind: {
                path: "$userData"
              }
            },
            {
              $project: {
                postedUser: 1,
                description: 1,
                imgVideoURL: 1,
                profilePic: "$userData.profilePic",
                liked: 1,
                createdAt: 1
              }
            }
          ])
    }

    const addPost = async(post:postInterface)=>{
      const newPost = new Post(post)
      return await newPost.save()
    }

    const unlikePost = async(userName:string,postId:string)=>{
      return await Post.findOneAndUpdate({_id:postId},{$pull:{liked:userName}})
    }
    
    const likePost = async(userName:string,postId:string)=>{
      return await Post.findOneAndUpdate({_id:postId},{$addToSet:{liked:userName}})
    }

    const getComments = async(postId:mongoose.Types.ObjectId)=>{
      const commentWithoutReply:any = await Comment.aggregate([
        {
          $match: {
            postId
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "commentedUser",
            foreignField: "userName",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
          },
        },
        {
          $project: {
            comment: 1,
            commentedUser: 1,
            profilePic: "$userData.profilePic",
            liked: 1,
            reply: 1,
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      
      if(commentWithoutReply.some((obj:{reply:[]})=>obj.reply.length)){
        return await Comment.aggregate([
          {
            $match: {
              postId
            }
          },
          {
            $unwind: {
              path: "$reply"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "commentedUser",
              foreignField: "userName",
              as: "userData"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "reply.commentedUser",
              foreignField: "userName",
              as: "user"
            }
          },
          {
            $unwind: {
              path: "$userData"
            }
          },
          {
            $unwind: {
              path: "$user"
            }
          },
          {
            $project: {
              comment: 1,
              commentedUser: 1,
              profilePic: "$userData.profilePic",
              liked: 1,
              reply: {
                _id: "$reply._id",
                comment: "$reply.comment",
                commentedUser: "$reply.commentedUser",
                liked:"$reply.liked",
                profilePic: "$user.profilePic",
                createdAt: "$reply.createdAt",
              },
              createdAt: 1
            }
          },
          {
            $group: {
              _id: "$_id",
              comment: {
                $first: "$comment"
              },
              commentedUser: {
                $first: "$commentedUser"
              },
              profilePic: {
                $first: "$profilePic"
              },
              liked: {
                $first: "$liked"
              },
              createdAt: {
                $first: "$createdAt"
              },
              reply: {
                $push: "$reply"
              }
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          }
        ])
      }else{
        return commentWithoutReply
      }
    }

    const addComment = async(comment:string,commentedUser:string,postId:string,commentId:string)=>{
      if(commentId.length){
        const replyData = {
          _id: new mongoose.Types.ObjectId(),
          comment:comment,
          commentedUser,
          liked:[],
          createdAt:new Date()
        }
        const reply = await Comment.updateOne({_id:commentId},{$push:{reply:replyData}})
        if(reply){
          return replyData
        }
      }else{
        const commentData = {
          comment,
          commentedUser,
          postId
        }
        const newComment = new Comment(commentData)
        return await newComment.save()
      }
    }

    const commentLikeUnlike = async(userName:string,commentId:mongoose.Types.ObjectId)=>{
      const likeStatus = await Comment.findOne({_id:commentId,liked:{$elemMatch:{$eq:userName}}})
      
      if(likeStatus===null){
        return await Comment.updateOne({_id:commentId},{$addToSet:{liked:userName}})
      }else{
        return await Comment.updateOne({_id:commentId},{$pull:{liked:userName}})
      }
    }

    const replyLikeUnlike = async(userName:string,commentId:string)=>{
      try{
        const commentID = new mongoose.Types.ObjectId(commentId)
        const likeStatus = await Comment.findOne({_id:commentID,"reply.liked":{$elemMatch:{$eq:userName}}})
        
        if(likeStatus===null){
          return await Comment.updateOne({_id:commentID},{$addToSet:{"reply.liked":userName}})
        }else{
          return await Comment.updateOne({_id:commentID},{$pull:{"reply.liked":userName}})
        }
      }catch(error){
        console.log(error)
      }
    }

    const postDelete = async(postId:string)=>{
      try{
        const postID = new mongoose.Types.ObjectId(postId)
        const operations = []
        operations.push(
          Comment.updateMany({postId:postID},{$set:{listed:false}}),
          Post.deleteOne({_id:postID}),
          User.updateMany({savedPosts:postID},{$pull:{savedPosts:postID}})
        )
        const results = await Promise.allSettled(operations)
        const isSuccess = results.every((result) => result.status === 'fulfilled')
        if(isSuccess){
          return true
        }
      }catch(error){
        console.log(error)
      }
    }

    const postReport = async(userName:string,postId:string)=>{
      try{
        const postID = new mongoose.Types.ObjectId(postId)
        return await Post.updateOne({_id:postID},{$addToSet:{reports:userName}})
      }catch(error){
        console.log(error)
      }
    }


    return {
        getPost,
        addPost,
        unlikePost,
        likePost,
        getComments,
        addComment,
        commentLikeUnlike,
        replyLikeUnlike,
        postDelete,
        postReport
    }
}

export type postRepositoryMongoDB = typeof postRepositoryMongoDB