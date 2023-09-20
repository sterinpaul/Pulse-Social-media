import { chatRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/chatHelperRepositories";

export const chatDbRepository = (repository:ReturnType<chatRepositoryMongoDB>)=>{

    const createSingleChat = async(senderId:string,receiverId:string)=>{
        return await repository.createChat(senderId,receiverId)
    }

    const getChats = async(userId:string)=>{
        return await repository.getAllChats(userId)
    }

    const getSingleUserChat = async(senderId:string,receiverId:string)=>{
        return await repository.getSingleChat(senderId,receiverId)
    }

    const getAllMessages = async(userId:string,receiverId:string)=>{
        return await repository.getMessages(userId,receiverId)
    }

    return {
        createSingleChat,
        getChats,
        getSingleUserChat,
        getAllMessages
    }
}
export type chatDbInterface = typeof chatDbRepository

