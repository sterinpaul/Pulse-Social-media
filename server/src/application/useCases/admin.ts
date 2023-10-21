import { AdminDbInterface } from "../repositories/adminDbRepository";


export const getUsersAndPostsCount = async(
    adminRepository:ReturnType<AdminDbInterface>
    )=>{
    const data = await adminRepository.getAllCount()
    if(data)return data
}

export const allUsers = async(
    status:string,
    pageNumber:number=0,
    adminRepository:ReturnType<AdminDbInterface>
    )=>{
        const data = await adminRepository.getAllUsers(status,pageNumber)
    if(data)return data
}

export const reportedPosts = async(
    pageNumber:number,
    adminRepository:ReturnType<AdminDbInterface>
    )=>{
        const data = await adminRepository.getReportedPosts(pageNumber)
    if(data)return data
}

export const singlePostBlock = async(
    postId:string,
    status:boolean,
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    const data = await adminRepository.postBlock(postId,status)
    if(data)return data
}

export const singleUserBlock = async(
    userId:string,
    status:boolean,
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    const data = await adminRepository.userBlock(userId,status)
    if(data)return data
}

export const searchUser = async(
    searchText:string,
    status:string,
    pageNumber:number,
    adminRepository:ReturnType<AdminDbInterface>
)=>{
    return await adminRepository.getUserBySearch(searchText,status,pageNumber)
}
