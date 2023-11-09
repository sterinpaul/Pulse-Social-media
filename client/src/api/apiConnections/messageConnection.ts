import baseURL from "../api";

export const createSingleMessage = async(chatId:string,senderId:string,receiverId:string,message:string)=>{
    try{
        const response = await baseURL.post('/message',{chatId,senderId,receiverId,message})
        return response?.data
    }catch(error){
        console.log(error)
    }
}

export const createSingleImgMessage = async(chatId:string,senderId:string,receiverId:string,imgChat:File)=>{
    try{
        const chatForm = new FormData
        chatForm.append('chatId',chatId)
        chatForm.append('senderId',senderId)
        chatForm.append('receiverId',receiverId)
        chatForm.append('imgChat',imgChat)
        const response = await baseURL.post('/message/img',chatForm,{
            headers:{'Content-Type' : 'multipart/form-data'}
        })
        return response?.data
    }catch(error){
        console.log(error)
    }
}

export const getAllChats = async(userId:string)=>{
    try{
        const chats = await baseURL.get(`/message/chat/${userId}`)
        return chats?.data
    }catch(error){
        console.log(error)
    }
}

export const getUserMessages = async(chatId:string)=>{
    try{
        const response = await baseURL.get(`/message/${chatId}`)
        return response?.data
    }catch(error){
        console.log(error)
    }
}
