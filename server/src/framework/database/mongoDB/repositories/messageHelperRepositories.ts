import Message from "../models/messageModel"

export const messageRepositoryMongoDB = ()=>{

    const createMessage = async(chatId:string,senderId:string,message:string)=>{
        try{
            const newMessage = new Message({
                chatId,
                senderId,
                message
            })
            const response = await newMessage.save()
            if(response) return response
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
        getMessges
    }
}

export type messageRepositoryMongoDB = typeof messageRepositoryMongoDB