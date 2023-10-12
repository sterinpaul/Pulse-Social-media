import express from "express";
import messageControllers from "../../../adapters/controllers/messageController";
import { messageRepositoryMongoDB } from "../../database/mongoDB/repositories/messageHelperRepositories";
import { messageDbRepository } from "../../../application/repositories/messageDbRepository";
import { uploadChatImg } from "../middlewares/cloudinaryConfig";


const messageRouter = ()=>{
    const router = express.Router()
    const controllers = messageControllers(messageDbRepository,messageRepositoryMongoDB)

    router.post('/',controllers.createSingleMessage)
    router.post('/img',uploadChatImg,controllers.createSingleImgMessage)
    router.get('/:chatId',controllers.getUserMessages)
    router.get('/chat/:userId',controllers.getChats)
    return router
}

export default messageRouter