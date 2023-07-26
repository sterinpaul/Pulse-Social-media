import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { configKeys } from '../../config';

export const authServices = ()=>{
    const encryptPassword = async(password:string)=>{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        return hashedPassword
    }
    const comparePassword = (password:string,hashedPassword:string)=>{
        return bcrypt.compare(password,hashedPassword)
    }
    const generateToken = (payload:string)=>{
        if(configKeys.JWT_SECRET_KEY){
            const token = jwt.sign({payload},configKeys.JWT_SECRET_KEY,{
                expiresIn:"2d"
            })
            return token
        }else{
            throw new Error("JWT Token is undefined");
        }
    }
    const verifyToken = (token:string)=>{
        if(configKeys.JWT_SECRET_KEY){
            const isValid = jwt.verify(token,configKeys.JWT_SECRET_KEY)
            return isValid
        }
        return undefined
    }

    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken
    }
}

// export default authServices
export type AuthServiceReturn = ReturnType<typeof authServices>
export type AuthServices = typeof authServices