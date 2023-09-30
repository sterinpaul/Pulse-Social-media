import mongoose from "mongoose"
import Message from "../models/messageModel"

export const messageRepositoryMongoDB = ()=>{

    const createMessage = async(chatId:string,senderId:string,message:string)=>{
        try{
            const newMessage = new Message({
                chatId,
                senderId,
                message
            })
            const response = await newMessage.save()
            if(response) return response
        }catch(error){
            console.log(error)
        }
    }

    const getAllChats = async(userId:string)=>{
        try{
            const userID = new mongoose.Types.ObjectId(userId)
            return await Message.aggregate([
                {
                  $project: {
                    chatId: 1,
                    createdAt: 1
                  }
                },
                {
                  $group: {
                    _id: "$chatId",
                    createdAt: {
                      $last: "$createdAt",
                    }
                  }
                },
                {
                  $sort: {
                    createdAt: -1
                  }
                },
                {
                  $addFields: {
                    chatId: {
                      $toObjectId: "$_id"
                    }
                  }
                },
                {
                  $lookup: {
                    from: "chats",
                    localField: "chatId",
                    foreignField: "_id",
                    as: "result"
                  }
                },
                {
                  $unwind: {
                    path: "$result"
                  }
                },
                {
                  $unwind: {
                    path: "$result.members"
                  }
                },
                {
                  $match: {
                    "result.members": {
                      $ne: userID,
                    }
                  }
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "result.members",
                    foreignField: "_id",
                    as: "result"
                  }
                },
                {
                  $unwind: {
                    path: "$result"
                  }
                },
                {
                  $project: {
                    _id: "$result._id",
                    chatId: 1,
                    userName: "$result.userName",
                    firstName: "$result.firstName",
                    lastName: "$result.lastName",
                    profilePic: "$result.profilePic",
                    createdAt: 1
                  }
                }
              ]
            )
        }catch(error){
            console.log(error)
        }
    }

    const getMessges = async(chatId:string)=>{
        try{
            const messages = await Message.find({chatId}).sort({createdAt:1})
            if(messages) return messages
        }catch(error){
            console.log(error)
        }
    }

    return {
        createMessage,
        getAllChats,
        getMessges
    }
}

export type messageRepositoryMongoDB = typeof messageRepositoryMongoDB