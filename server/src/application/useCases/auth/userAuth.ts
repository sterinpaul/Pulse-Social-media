import { UserDbInterface } from "../../repositories/userDbRepository"
import { AuthServiceInterface } from "../../services/authServiceInterfaces"
// import { createUser } from "../../../entity/userEntity"

export const userSignUp = async(
    user:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string,
        mobile:string
    },
    userRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    user.email = user.email.toLowerCase()
    user.userName = user.userName.toLowerCase()
    const isEmailExist = await userRepository.getUserByEmail(user.email)
    if(isEmailExist){
        const userData = {
            status:"failed",
            message:"Email already exists",
            user:{},
            token:''
        }
        return userData
    }

    const isUserNameExist = await userRepository.getUserByUsername(user.userName)
    
    if(isUserNameExist){
        const userData = {
            status:"failed",
            message:"Username already exists",
            user:{},
            token:''
        }
        return userData
    }

    let encryptPassword = await authService.encryptPassword(user.password)
    user.password = encryptPassword
    // const UserEntity = createUser(...user)
    const data = await userRepository.addUser(user)
    const jwtToken = await authService.generateToken(data._id?.toString())

    const userData = {
        status:"success",
        message:"Registration Success",
        user:data,
        token:jwtToken
    }
    return userData
}

export const userSignIn = async(
    userName:string,
    password:string,
    userRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    userName = userName.toLowerCase()
    const data:any = await userRepository.getUser(userName)
    if(!data){
        const userData = {
            status:"failed",
            message:"User does not exist",
            user:{},
            token:''
        }
        return userData
    }
    if(data?.isBlocked){
        const userData = {
            status:"failed",
            message:"User is blocked",
            user:{},
            token:''
        }
        return userData
    }
    const isPassword = await authService.comparePassword(password,data?.password)
    if(!isPassword){
        const userData = {
            status:"failed",
            message:"Password incorrect",
            user:{},
            token:''
        }
        return userData
    }
    const jwtToken = await authService.generateToken(data?._id?.toString())
    data.password = '';
    const userData = {
        status:"success",
        message:"Sign in Success",
        user:data,
        token:jwtToken
    }
    return userData
}

export const userGoogleSignIn = async(
    email:string,
    userRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    const userByEmail = await userRepository.getUserByEmail(email)
    
    if(userByEmail?.isBlocked){
        const userData = {
            status:"blocked",
            message:"User is blocked"
        }
        return userData
    }

    if(userByEmail?.isBlocked===false){
        const jwtToken = await authService.generateToken(userByEmail._id?.toString())
        userByEmail.password = '';
        const userData = {
            status:"success",
            message:"Sign in Success",
            user:userByEmail,
            token:jwtToken
        }
        return userData
    }else{
        const userData = {
            status:"failed",
            message:"Add User name to proceed"
        }
        return userData
    }
}

export const userGoogleRegistration = async(
    user:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string,
        mobile:string
    },
    userRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
    )=>{
        const isUserNameExist = await userRepository.getUserByUsername(user.userName)
    
        if(isUserNameExist){
            const userData = {
                status:"failed",
                message:"Username already exists"
            }
            return userData
        }
        const data = await userRepository.addUser(user)
        const jwtToken = await authService.generateToken(data._id?.toString())
        const userData = {
            status:"success",
            message:"Sign in Success",
            user:data,
            token:jwtToken
        }
        
        return userData
    }