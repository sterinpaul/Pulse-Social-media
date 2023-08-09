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
        return await User.findOne({email})
    }

    const getUserByUserName = async(userName:string)=>{
        return await User.findOne({userName})
    }

    const getUserByMobile = async(mobile:string)=>{
        return await User.findOne({mobile})
    }

    const getUserByNameMailMobile = async(userData:string)=>{
        return await User.findOne({$or:[{userName:userData},{email:userData},{mobile:userData}]})
    }

    const postProfilePicture = async(userName:string,profilePic:string)=>{
        return await User.updateOne({userName},{$set:{profilePic}})
    }

    return {
        addUser,
        getUserByEmail,
        getUserByUserName,
        getUserByMobile,
        getUserByNameMailMobile,
        postProfilePicture
    }
}

export type userRepositoryMongoDB = typeof userRepositoryMongoDB