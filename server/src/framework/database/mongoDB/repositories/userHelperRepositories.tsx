import User from "../models/userModel"

interface userInterface{
    firstName:string,
    lastName:string,
    userName:string,
    email:string,
    password?:string
}
export const userRepositoryMongoDB = ()=>{

    const addUser = async(addedUser:userInterface)=>{
        const newUser = new User(addedUser)
        return await newUser.save()
    }

    const getUserByEmail = async(email:string)=>{
        const user = await User.findOne({email})
        return user
    }

    const getUserByUserName = async(userName:string)=>{
        const user = await User.findOne({userName})
        return user
    }

    return {
        addUser,
        getUserByEmail,
        getUserByUserName
    }
}

export type userRepositoryMongoDB = typeof userRepositoryMongoDB