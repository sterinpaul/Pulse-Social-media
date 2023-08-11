import express from "express";
import postControllers from "../../../adapters/controllers/postController";
import { postRepositoryMongoDB } from "../../database/mongoDB/repositories/postHelperRepositories";
import { postDbRepository } from "../../../application/repositories/postDbRepository";
import { uploadPostImgVideo } from "../middlewares/cloudinaryConfig";

const postRouter = ()=>{
    const router = express.Router()
    const controllers = postControllers(postDbRepository,postRepositoryMongoDB)
    router.get('/getpost',controllers.getPost)
    router.post('/addpost',uploadPostImgVideo,controllers.addPost)
    
    return router
}

export default postRouter