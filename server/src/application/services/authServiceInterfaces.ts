import { AuthServiceReturn } from "../../framework/services/authServices";

export const authServiceInterface = (service:AuthServiceReturn)=>{
    const encryptPassword = async(password:string)=>{
        return await service.encryptPassword(password)
    }
    const comparePassword = async(password:string,hashedPassword:string)=>{
        return await service.comparePassword(password,hashedPassword)
    }
    const generateToken = async(payload:string)=>{
        return service.generateToken(payload)
    }
    const verifyToken = async(token:string)=>{
        return service.verifyToken(token)
    }

    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken
    }
}

export type AuthServiceInterface = typeof authServiceInterface
