import express from "express";
import userControllers from "../../../adapters/controllers/userController";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userHelperRepositories";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { uploadProfilePic } from '../middlewares/cloudinaryConfig'

const userRouter = ()=>{
    const router = express.Router()
    const controllers = userControllers(userDbRepository,userRepositoryMongoDB)
    router.get('/:user',controllers.getProfile)
    router.post('/updatephoto',uploadProfilePic,controllers.updateProfilePic)
    return router
}

export default userRouter