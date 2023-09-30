import baseURL from "../api";
// import headers from "../socketAPI";

export const createNewChat = async(senderId:string,receiverId:string)=>{
    try{
        const response = await baseURL.post(`/chat/${senderId}/${receiverId}`)
        return response?.data
    }catch(error){
        console.log(error)
    }
}


export const getSingleUserChat = async(senderId:string,receiverId:string)=>{
    try{
        const response = await baseURL.get(`/chat/${senderId}/${receiverId}`)
        return response?.data
    }catch(error){
        console.log(error)
    }
}


export const getAllChats = async(userId:string)=>{
    try{
        const chats = await baseURL.get(`/chat/${userId}`)
        return chats.data
    }catch(error){
        console.log(error)
    }
}


export const getAllMessages = async(userId:string,receiverId:string)=>{
    try{
        const response = await baseURL.get(`/chat/${userId}/${receiverId}`)
        return response?.data
    }catch(error){
        console.log(error)
    }
}
