import baseURL from "../api";
// import headers from "../socketAPI";

export const createSingleMessage = async(chatId:string,senderId:string,message:string)=>{
    try{
        const response = await baseURL.post('/message',{chatId,senderId,message})
        return response?.data
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
