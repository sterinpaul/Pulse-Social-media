import express from "express";
import adminControllers from "../../../adapters/controllers/adminController";
import { adminRepositoryMongoDB } from "../../database/mongoDB/repositories/adminHelperRepositories";
import { adminDbRepository } from "../../../application/repositories/adminDbRepository";


const adminRouter = ()=>{
    const router = express.Router()
    const controllers = adminControllers(adminDbRepository,adminRepositoryMongoDB)
    router.get('/',controllers.getHome)
    router.get('/users/:status/:pageNumber',controllers.getAllUsers)
    router.get('/reports',controllers.getReportedPosts)
    router.patch('/block-post',controllers.postBlockhandler)
    router.patch('/block-user',controllers.userBlockhandler)
    router.get('/search-user',controllers.getUserBySearch)
    
    return router
}

export default adminRouter