import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { chatDbInterface } from "../../application/repositories/chatDbRepository";
import { chatRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/chatHelperRepositories";
import { createChat, getAllChats, getSingleChat, getAllTheMessages} from "../../application/useCases/chat";


const chatControllers = (
    chatDbInterface:chatDbInterface,
    chatDbService:chatRepositoryMongoDB
)=>{
    const chatDbRepository = chatDbInterface(chatDbService())

    const createNewChat = asyncHandler(async(req:Request,res:Response)=>{
        const {senderId,receiverId} = req.params
        const response = await createChat(senderId,receiverId,chatDbRepository)
        if(response){
            const chatData = {
                status:true,
                data:response
            }
            res.json(chatData)
        }
    })

    const getSingleUserChat = asyncHandler(async(req:Request,res:Response)=>{
        const {senderId,receiverId} = req.params
        const response = await getSingleChat(senderId,receiverId,chatDbRepository)
        res.json(response)
    })

    const getChats = asyncHandler(async(req:Request,res:Response)=>{
        const userId = req.params.userId
        const response = await getAllChats(userId,chatDbRepository)
        if(response){
            const chatMessageData = {
                status:true,
                data:response
            }
            res.json(chatMessageData)
        }
    })

    const getAllMessages = asyncHandler(async(req:Request,res:Response)=>{
        const {userId,receiverId} = req.params
        const response = await getAllTheMessages(userId,receiverId,chatDbRepository)
        if(response){
            const chatMessageData = {
                status:true,
                data:response
            }
            res.json(chatMessageData)
        }
    })

    return {
        createNewChat,
        getSingleUserChat,
        getChats,
        getAllMessages
    }
}

export default chatControllers