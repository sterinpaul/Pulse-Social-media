import mongoose from "mongoose"
import Chat from "../models/chatModel"


export const chatRepositoryMongoDB = ()=>{

    const createChat = async(senderId:string,receiverId:string)=>{
        try{
            const senderID = new mongoose.Types.ObjectId(senderId)
            const receiverID = new mongoose.Types.ObjectId(receiverId)
            const chatExists = await Chat.find(
                {members:{$all:[senderID,receiverID]}}
            )
            
            if(chatExists.length){
                return chatExists
            }else{
                const newChat = new Chat({
                    members:[senderID,receiverID]
                })
                const response = await newChat.save()
                return response
            }
        }catch(error){
            console.log(error)
        }
    }

    const getAllChats = async(userId:string)=>{
        try{
            const userID = new mongoose.Types.ObjectId(userId)
            return await Chat.aggregate([
                {
                  $match: {
                    members: userID
                  }
                },
                {
                  $unwind: {
                    path: "$members",
                  },
                },
                {
                  $match: {
                    members: {
                      $ne: userID,
                    },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "result",
                  },
                },
                {
                  $unwind: {
                    path: "$result",
                  },
                },
                {
                  $project: {
                    _id: "$members",
                    chatId: "$_id",
                    userName: "$result.userName",
                    firstName: "$result.firstName",
                    lastName: "$result.lastName",
                    profilePic: "$result.profilePic",
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
                {
                  $sort: {
                    updatedAt: -1,
                  },
                },
              ]
            )
        }catch(error){
            console.log(error)
        }
    }

    const getSingleChat = async(senderId:string,receiverId:string)=>{
        try{
            return await Chat.findOne({members:{$all:[senderId,receiverId]}})
        }catch(error){
            console.log(error)
        }
    }

    const getMessages = async(userId:string,receiverId:string)=>{
        try{
            return []
        }catch(error){
            console.log(error)
        }
    }

    return {
        createChat,
        getAllChats,
        getSingleChat,
        getMessages
    }
}

export type chatRepositoryMongoDB = typeof chatRepositoryMongoDB