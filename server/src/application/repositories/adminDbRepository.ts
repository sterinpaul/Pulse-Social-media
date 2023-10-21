import { adminRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/adminHelperRepositories";

export const adminDbRepository = (repository:ReturnType<adminRepositoryMongoDB>)=>{

    const getAdminByEmail = async(email:string)=>{
        return await repository.getAdminByEmail(email)
    }

    const getAllCount = async()=>{
        return await repository.getCount()
    }

    const getAllUsers = async(status:string,pageNumber:number)=>{
        return await repository.allUsers(status,pageNumber)
    }

    const getReportedPosts = async(pageNumber:number)=>{
        return await repository.getAllReported(pageNumber)
    }

    const postBlock = async(postId:string,status:boolean)=>{
        return await repository.postBlockHandler(postId,status)
    }

    const userBlock = async(userId:string,status:boolean)=>{
        return await repository.userBlockHandler(userId,status)
    }

    const getUserBySearch = async(searchText:string,status:string,pageNumber:number)=>{
        return await repository.userSearch(searchText,status,pageNumber)
    }

  

    return {
        getAdminByEmail,
        getAllCount,
        getAllUsers,
        getReportedPosts,
        postBlock,
        userBlock,
        getUserBySearch
    }
}
export type AdminDbInterface = typeof adminDbRepository