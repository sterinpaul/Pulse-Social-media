import { messageDbInterface } from "../repositories/messageDbRepository";

export const createMessage = async(
    chatId:string,
    senderId:string,
    message:string,
    messageRepository:ReturnType<messageDbInterface>
)=>{
    return await messageRepository.createSingleMessage(chatId,senderId,message)
}

export const getMessages = async(
    chatId:string,
    messageRepository:ReturnType<messageDbInterface>
)=>{
    return await messageRepository.getAllMessges(chatId)
}

