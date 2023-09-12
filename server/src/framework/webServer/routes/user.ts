import express from "express";
import userControllers from "../../../adapters/controllers/userController";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userHelperRepositories";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { uploadProfilePic } from '../middlewares/cloudinaryConfig'

const userRouter = ()=>{
    const router = express.Router()
    const controllers = userControllers(userDbRepository,userRepositoryMongoDB)
    router.get('/',controllers.getHome)
    router.get('/getpost',controllers.getPost)
    router.get('/:user',controllers.getProfile)
    router.post('/updatephoto',uploadProfilePic,controllers.updateProfilePic)
    router.put('/followunfollow',controllers.followUnfollow)
    router.put('/savepost',controllers.saveThePost)
    router.get('/post/savedposts',controllers.getUserSavedPosts)
    router.get('/search/user',controllers.getUserBySearch)
    router.patch('/updateusername',controllers.updateUserName)
    router.post('/updateprofile',controllers.updateUserData)

    return router
}

export default userRouter