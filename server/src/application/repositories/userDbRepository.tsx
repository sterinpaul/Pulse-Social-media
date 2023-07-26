import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";

export const userDbRepository = (repository:ReturnType<userRepositoryMongoDB>)=>{
    const addUser = async(user:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string
    })=>{
        return await repository.addUser(user)
    }

    const getUserByEmail = async(email:string)=>{
        return await repository.getUserByEmail(email)
    }

    const getUserByUsername = async(userName:string)=>{
        return await repository.getUserByUserName(userName)
    }

    return {
        addUser,
        getUserByEmail,
        getUserByUsername
    }
}
export type UserDbInterface = typeof userDbRepository