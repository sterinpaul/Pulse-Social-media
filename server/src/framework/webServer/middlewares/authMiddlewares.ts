import { Request,Response,NextFunction } from "express";
import { authServices } from "../../services/authServices";

const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    let token:string | null = null
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }
    try{
        if(typeof token === "string"){
            const {payload}:any = authServices()?.verifyToken(token)
            req.params._id = payload
            if(payload) next()
        }
    }catch(error){
        console.log(error);
    }
}

export default userMiddleware