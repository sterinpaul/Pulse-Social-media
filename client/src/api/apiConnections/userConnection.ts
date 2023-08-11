import baseURL from "../api";

export const getUserHome = async():Promise<object> =>{
    try{
        const response = await baseURL.get('/user')
        return response?.data
    }catch(error){
        throw error
    }
}

export const getProfile = async(userName:string):Promise<object> =>{
    try{
        const response = await baseURL.get(`/user/${userName}`)
        return response?.data
    }catch(error){
        throw error
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