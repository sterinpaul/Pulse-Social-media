import baseURL from "../api";

export const getTotalPostsAndUsers = async() =>{
    try{
        const response = await baseURL.get('/admin')
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const reportedPosts = async(pageNumber:number)=>{
    try{
        const response = await baseURL.get(`/admin/reports?pageNumber=${pageNumber}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getTotalUsers = async(status:string,pageNumber:number)=>{
    try{
        const response = await baseURL.get(`/admin/users/${status}/${pageNumber}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const postBlockhandler = async(postId:string,status:boolean)=>{
    try{
        const response = await baseURL.patch(`/admin/block-post`,{postId,status})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const userBlockhandler = async(userId:string,status:boolean)=>{
    try{
        const response = await baseURL.patch(`/admin/block-user`,{userId,status})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const searchUser = async(searchText:string,status:string,pageNumber:number)=>{
    try{
        const response = await baseURL.get(`/admin/search-user?searchText=${searchText}&status=${status}&pageNumber=${pageNumber}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}