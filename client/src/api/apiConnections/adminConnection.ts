import baseURL from "../api";

export const getTotalPostsAndUsers = async() =>{
    try{
        const response = await baseURL.get('/admin')
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const reportedPosts = async() =>{
    try{
        const response = await baseURL.get('/admin/reports')
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getAllPosts = async()=>{
    try{
        const response = await baseURL.get(`/admin/getpost`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}
