import express from "express";
import adminAuthControllers from "../../../adapters/controllers/adminAuthController";
import {authServices} from "../../services/authServices";
import { authServiceInterface } from "../../../application/services/authServiceInterfaces";
import { adminRepositoryMongoDB } from "../../database/mongoDB/repositories/adminHelperRepositories";
import { adminDbRepository } from "../../../application/repositories/adminDbRepository";

const adminAuthRouter = ()=>{
    const router = express.Router()
    const controllers = adminAuthControllers(
        authServiceInterface,
        authServices,
        adminDbRepository,
        adminRepositoryMongoDB
        )
        router.post('/adminsignin',controllers.signInAdmin)

    return router
}

export default adminAuthRouter