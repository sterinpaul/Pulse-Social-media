import baseURL from "../api";


export const getAllPosts = async()=>{
    try{
        const response = await baseURL.get(`/post/getpost`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}
export const publishNewPost = async(description:string,imgVideo:File):Promise<object>=>{
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
export const unlikePost = async(postId:string)=>{
    try{
        return await baseURL.put('/post/unlike',{postId:postId})
    }catch(error){
        throw error
    }
}
export const likePost = async(postId:string)=>{
    try{
        return await baseURL.put('/post/like',{postId:postId})
    }catch(error){
        throw error
    }
}
export const getPostComments = async(postId:string)=>{
    try{
        const response = await baseURL.get(`/post/comment/${postId}`)
        return response?.data
    }catch(error){
        throw error
    }
}
export const postComment = async(comment:string,postId:string,commentId:string,replyToUser:string)=>{
    try{
        const formData = {
            'comment':comment,
            'postId':postId,
            'commentId':commentId,
            'replyToUser':replyToUser
        }
        
        const response = await baseURL.post('/post/addcomment',formData)
        return response?.data
    }catch(error){
        throw error
    }
}
export const likeComment = async(commentId:string)=>{
    try{
        const response = await baseURL.put('/post/comment/likeunlike',{commentId})
        return response?.data
    }catch(error){
        throw error
    }
}

export const likeReply = async(commentId:string)=>{
    try{
        const response = await baseURL.put('/post/reply/likeunlike',{commentId})
        return response?.data
    }catch(error){
        throw error
    }
}

export const deleteThePost = async(postId:string)=>{
    try{
        const response = await baseURL.patch(`/post/delete/${postId}`)
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const reportThePost = async(postId:string,selectedReason:string)=>{
    try{
        const response = await baseURL.put('/post/report',{postId,selectedReason})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}

export const updateSinglePost = async(postId:string,description:string)=>{
    try{
        const response = await baseURL.patch('/post/editpost',{postId,description})
        return response?.data
    }catch(error:any){
        return error.response.data
    }
}
