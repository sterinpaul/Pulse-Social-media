import { adminRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/adminHelperRepositories";

export const adminDbRepository = (repository:ReturnType<adminRepositoryMongoDB>)=>{

    const getAdminByEmail = async(email:string)=>{
        return await repository.getAdminByEmail(email)
    }

    const getAllCount = async()=>{
        return await repository.getCount()
    }

    const getReportedPosts = async()=>{
        return await repository.getAllReported()
    }

    const getAllPost = async()=>{
        return await repository.getPost()
    }

    const getUserBySearch = async(searchText:string)=>{
        return await repository.userSearch(searchText)
    }

  

    return {
        getAdminByEmail,
        getAllCount,
        getReportedPosts,
        getAllPost,
        getUserBySearch
    }
}
export type AdminDbInterface = typeof adminDbRepository