import baseURL from "../api";


export const getAllPosts = async():Promise<object>=>{
    try{
        const response = await baseURL.get(`/post/getpost`)
        console.log("getAllPosts response",response.data)
        return response?.data
    }catch(error){
        throw error
    }
}
export const publishNewPost = async(postData:object):Promise<object>=>{
    try{
        const response = await baseURL.post(`/post/addpost`,postData)
        console.log("publishNewPost response",response)
        return response?.data
    }catch(error){
        throw error
    }
}