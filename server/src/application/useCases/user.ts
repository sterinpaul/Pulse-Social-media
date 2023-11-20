import { UserDbInterface } from "../repositories/userDbRepository";

export const getAllPosts = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data = await userRepository.getAllPost(userName)
    if(data)return data
}

export const getNotificationData = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.getUserNotifications(userName)
}

export const getUserProfile = async(
    userName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    const data:{password:string} = await userRepository.getUserByUsername(userName)
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

export const userNameUpdate = async(
    userName:string,
    newUserName:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return await userRepository.updateUserName(userName,newUserName)
}

export const userProfileUpdate = async(
    userName:string,
    firstName:string,
    lastName:string,
    gender:string,
    city:string,
    bio:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return userRepository.updateUserProfile(userName,firstName,lastName,gender,city,bio)
}

export const removeUserNotification = async(
    userName:string,
    id:string,
    userRepository:ReturnType<UserDbInterface>
)=>{
    return userRepository.removeNotification(userName,id)
}