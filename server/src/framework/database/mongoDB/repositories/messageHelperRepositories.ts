import mongoose from "mongoose"
import Message from "../models/messageModel"
import Chat from "../models/chatModel"

export const messageRepositoryMongoDB = ()=>{

    const createMessage = async(chatId:string,senderId:string,receiverId:string,message:string,imgURL:string)=>{
        try{
          
          if(chatId){
            const newMessage = new Message({
              chatId,
              senderId,
              message,
              imgURL
            })
            const response = await newMessage.save()
            if(response) return response
          }else{
            const senderID = new mongoose.Types.ObjectId(senderId)
            const receiverID = new mongoose.Types.ObjectId(receiverId)
            const newChat = new Chat({
              members:[senderID,receiverID]
            })
            const response = await newChat.save()
            if(response){
              const newMessage = new Message({
                chatId:response?._id,
                senderId,
                message,
                imgURL
              })
              const newResponse = await newMessage.save()
              if(newResponse) return newResponse
            }
          }
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
                  $match: {
                    "result.members": {
                      $in: [
                        userID
                      ]
                    }
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