import { messageDbInterface } from "../repositories/messageDbRepository";

export const createMessage = async(
    chatId:string,
    senderId:string,
    message:string,
    messageRepository:ReturnType<messageDbInterface>
)=>{
    return await messageRepository.createSingleMessage(chatId,senderId,message)
}

export const getAllChats = async(
    userId:string,
    chatRepository:ReturnType<messageDbInterface>
)=>{
    const data = await chatRepository.getChats(userId)
    if(data){
        return data
    }
}

export const getMessages = async(
    chatId:string,
    messageRepository:ReturnType<messageDbInterface>
)=>{
    return await messageRepository.getAllMessges(chatId)
}

