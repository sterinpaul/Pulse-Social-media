import { AdminDbInterface } from "../repositories/adminDbRepository";

export const getAllPosts = async(
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    const data = await adminRepository.getAllPost()
    if(data)return data
}


export const getUsersAndPostsCount = async(
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    const data = await adminRepository.getAllCount()
    if(data)return data
}

export const reportedPosts = async(
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    const data = await adminRepository.getReportedPosts()
    if(data)return data
}

export const searchUser = async(
    searchText:string,
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    return await adminRepository.getUserBySearch(searchText)
}
