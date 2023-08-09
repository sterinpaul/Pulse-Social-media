import baseURL from "../api";

// interface Post {
//     _id: string,
//     postedUser: string,
//     imgVideoURL: string,
//     comments:string,
//     liked: any[],
//     reports: any[],
// }

export const getProfile = async(userName:string):Promise<object> =>{
    try{
        const response = await baseURL.get(`/user/${userName}`)
        return response?.data
    }catch(error){
        throw error
    }
}
export const getAllPosts = async(userName:string):Promise<any>=>{
    try{
        const response = await baseURL.get(`/user/getpost/${userName}`)
        console.log("getAllPosts response",response)
        return response?.data
    }catch(error){
        throw error
    }
}
export const publishNewPost = async(postData:object):Promise<object>=>{
    try{
        const response = await baseURL.post(`/user/addpost`,postData)
        console.log("publishNewPost response",response)
        return response?.data
    }catch(error){
        throw error
    }
}

export const updateProfilePhoto = async(userName:string,profilePic:File):Promise<object>=>{
    try{
        const formData = new FormData();
        formData.append('profilePic', profilePic)
        formData.append('userName', userName)
        const response = await baseURL.post('/user/updatephoto',formData,{
            headers:{'Content-Type' : 'multipart/form-data'}
        })
        return response?.data
    }catch(error){
        throw error
    }
}