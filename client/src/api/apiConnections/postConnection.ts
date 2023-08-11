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
export const publishNewPost = async(description:string,imgVideo:File | string = ''):Promise<object>=>{
    try{
        const formData = new FormData()
        formData.append('description',description)
        formData.append('postImgVideo',imgVideo)
        const response = await baseURL.post(`/post/addpost`,formData,{
            headers:{'Content-Type' : 'multipart/form-data'}
        })
        return response?.data
    }catch(error){
        throw error
    }
}