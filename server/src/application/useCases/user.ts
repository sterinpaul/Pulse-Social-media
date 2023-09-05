import { UserDbInterface } from "../repositories/userDbRepository";

export const getAllPosts = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data = await userRepository.getAllPost(userName)
    if(data){
        return data
    }
}

export const getUserProfile = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data = await userRepository.getUserByUsername(userName)
    if(data[0]){
        data[0].password = ''
        return data[0]
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

export const followUnfollowUser = async(
    userName:string,
    followUser:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.followUnfollowHandler(userName,followUser)
}

export const postSaveHandler = async(
    userName:string,
    postId:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.saveThePost(userName,postId)
}

export const getSavedPosts = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.getSavedPosts(userName)
}

export const searchUser = async(
    searchText:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.getUserBySearch(searchText)
}