import express from "express";
import chatControllers from "../../../adapters/controllers/chatController";
import { chatRepositoryMongoDB } from "../../database/mongoDB/repositories/chatHelperRepositories";
import { chatDbRepository } from "../../../application/repositories/chatDbRepository";


const chatRouter = ()=>{
    const router = express.Router()
    const controllers = chatControllers(chatDbRepository,chatRepositoryMongoDB)
    router.post('/:senderId/:receiverId',controllers.createNewChat)
    // router.get('/:senderId/:receiverId',controllers.getSingleUserChat)
    router.get('/:userId',controllers.getChats)
    router.get('/:userId/:receiverId',controllers.getAllMessages)
    
    return router
}

export default chatRouter