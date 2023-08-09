import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";

export const userDbRepository = (repository:ReturnType<userRepositoryMongoDB>)=>{
    const addUser = async(user:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string
    })=>{
        const addedUser = await repository.addUser(user)
        addedUser.password = ""
        return addedUser
    }

    const getUserByEmail = async(email:string)=>{
        return await repository.getUserByEmail(email)
    }

    const getUserByUsername = async(userName:string)=>{
        return await repository.getUserByUserName(userName)
    }

    const getUserByMobile = async(mobile:string)=>{
        return await repository.getUserByMobile(mobile)
    }

    const getUser = async(userData:string)=>{
        return await repository.getUserByNameMailMobile(userData)
    }

    const postProfilePicture = async(userName:string,profilePic:string)=>{
        return await repository.postProfilePicture(userName,profilePic)
    }

    return {
        addUser,
        getUser,
        getUserByEmail,
        getUserByUsername,
        getUserByMobile,
        postProfilePicture
    }
}
export type UserDbInterface = typeof userDbRepository