import { Request,Response,NextFunction } from "express";
import { authServices } from "../../services/authServices";

const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    let token:string | null = null
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }
    try{
        if(typeof token === "string"){
            const response = authServices().verifyToken(token)
            if(response){
                next()
            } else {
                res.status(400).json({ message: "Unauthorized" })
            }
        }
    }catch(error){
        res.status(400).json({ message: "Token expired" })
    }
}

export default userMiddleware