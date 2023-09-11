import { userRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/userHelperRepositories";

export const userDbRepository = (repository:ReturnType<userRepositoryMongoDB>)=>{
    const addUser = async(user:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string,
        mobile:string
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

    const getAllPost = async(userName:string)=>{
        return await repository.getPost(userName)
    }

    const postProfilePicture = async(userName:string,profilePic:string)=>{
        return await repository.postProfilePicture(userName,profilePic)
    }

    const followUnfollowHandler = async(userName:string,followUser:string)=>{
        return await repository.followHandler(userName,followUser)
    }

    const saveThePost = async(userName:string,postId:string)=>{
        return await repository.postSave(userName,postId)
    }

    const getSavedPosts = async(userName:string)=>{
        return await repository.userSavedPosts(userName)
    }

    const getUserBySearch = async(searchText:string)=>{
        return await repository.userSearch(searchText)
    }

    const updateUserName = async(userName:string)=>{
        return await repository.userNameUpdate(userName)
    }

    return {
        addUser,
        getUser,
        getUserByEmail,
        getUserByUsername,
        getUserByMobile,
        getAllPost,
        postProfilePicture,
        followUnfollowHandler,
        saveThePost,
        getSavedPosts,
        getUserBySearch,
        updateUserName
    }
}
export type UserDbInterface = typeof userDbRepository