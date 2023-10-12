import express from "express";
import adminControllers from "../../../adapters/controllers/adminController";
import { adminRepositoryMongoDB } from "../../database/mongoDB/repositories/adminHelperRepositories";
import { adminDbRepository } from "../../../application/repositories/adminDbRepository";


const adminRouter = ()=>{
    const router = express.Router()
    const controllers = adminControllers(adminDbRepository,adminRepositoryMongoDB)
    router.get('/',controllers.getHome)
    router.get('/reports',controllers.getReportedPosts)
    router.get('/getpost',controllers.getPost)
    
    return router
}

export default adminRouter