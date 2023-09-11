import baseURL from "../api";

export const getUserHome = async() =>{
    try{
        const response = await baseURL.get('/user')
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getAllPosts = async()=>{
    try{
        const response = await baseURL.get(`/user/getpost`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getProfile = async(userName:string):Promise<object> =>{
    try{
        const response = await baseURL.get(`/user/${userName}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const updateProfilePhoto = async(profilePic:File):Promise<object>=>{
    try{
        const formData = new FormData();
        formData.append('profilePic', profilePic)
        const response = await baseURL.post('/user/updatephoto',formData,{
            headers:{'Content-Type' : 'multipart/form-data'}
        })
        return response?.data
    }catch(error){
        throw error
    }
}

export const followHandler = async(user:string):Promise<object>=>{
    try{
        const response = await baseURL.put('/user/followUnfollow',{user})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const saveHandler = async(postId:string)=>{
    try{
        const response = await baseURL.put('/user/savepost',{postId})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getSavedPosts = async()=>{
    try{
        const response = await baseURL.get('/user/post/savedposts')
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const getUserbySearch = async(searchText:string)=>{
    try{
        const response = await baseURL.get(`/user/search/user?searchText=${searchText}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const userNameChange = async(userName:string)=>{
    try{
        const response = await baseURL.patch('/user/updateusername',{userName})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

// export const updateProfileData = async(userData:)=>{
//     try{
//         const response = baseURL.put('/user/')
//     }
// }