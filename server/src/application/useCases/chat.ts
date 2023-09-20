import { chatDbInterface } from "../repositories/chatDbRepository";

export const createChat = async(
    senderId:string,
    receiverId:string,
    chatRepository:ReturnType<chatDbInterface>
)=>{
    return await chatRepository.createSingleChat(senderId,receiverId)
}

export const getSingleChat = async(
    senderId:string,
    receiverId:string,
    chatRepository:ReturnType<chatDbInterface>
)=>{
    return await chatRepository.getSingleUserChat(senderId,receiverId)
}

export const getAllChats = async(
    userId:string,
    chatRepository:ReturnType<chatDbInterface>
)=>{
    const data = await chatRepository.getChats(userId)
    if(data){
        return data
    }
}

export const getAllTheMessages = async(
    userId:string,
    receiverId:string,
    chatRepository:ReturnType<chatDbInterface>
)=>{
    return await chatRepository.getAllMessages(userId,receiverId)
}