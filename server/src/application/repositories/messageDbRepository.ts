import { messageRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/messageHelperRepositories";

export const messageDbRepository = (repository:ReturnType<messageRepositoryMongoDB>)=>{

    const createSingleMessage = async(chatId:string,senderId:string,receiverId:string,message:string,imgURL:string)=>{
        return await repository.createMessage(chatId,senderId,receiverId,message,imgURL)
    }

    const getChats = async(userId:string)=>{
        return await repository.getAllChats(userId)
    }

    const getAllMessges = async(chatId:string)=>{
        return await repository.getMessges(chatId)
    }

    return {
        createSingleMessage,
        getChats,
        getAllMessges
    }
}

export type messageDbInterface = typeof messageDbRepository
