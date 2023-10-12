import { Request,Response } from "express";
import asyncHandler from 'express-async-handler';
import { AuthServices } from "../../framework/services/authServices";
import { AuthServiceInterface } from "../../application/services/authServiceInterfaces";
import { AdminDbInterface } from "../../application/repositories/adminDbRepository";
import { adminRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/adminHelperRepositories";
import { adminSignIn } from "../../application/useCases/auth/adminAuth";

const adminAuthControllers = (
    authServiceInterface:AuthServiceInterface,
    authServices:AuthServices,
    adminDbInterface:AdminDbInterface,
    adminDbService:adminRepositoryMongoDB
)=>{
    const adminDbRepository = adminDbInterface(adminDbService())
    const authService = authServiceInterface(authServices())
    

    const signInAdmin = asyncHandler(async(req:Request,res:Response)=>{
        const {adminEmail,password} : {adminEmail:string,password:string} = req.body
        const userData = await adminSignIn(adminEmail,password,adminDbRepository,authService)
        res.json(userData)
    })


    return {
        signInAdmin
    }
}

export default adminAuthControllers