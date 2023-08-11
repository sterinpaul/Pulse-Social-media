import { UserDbInterface } from "../repositories/userDbRepository";


export const getUserProfile = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data = await userRepository.getUserByUsername(userName)
    if(data){
        data.password = ''
        return data
    }
}

export const postProfilePic = async(
    userName:string,
    profilePic:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data = await userRepository.postProfilePicture(userName,profilePic)
    if(data){
        return data
    }
}