import { postDbInterface } from "../repositories/postDbRepository";

interface Post{
    postedUser: string,
    description: string,
    imgVideoURL: string
}

export const getAllPosts = async(
    postRepository:ReturnType<postDbInterface>
)=>{
    const data = await postRepository.getAllPost()
    if(data){
        return data
    }
}

export const addNewPost = async(
    postData:Post,
    postRepository:ReturnType<postDbInterface>,
)=>{
    const data = await postRepository.addPost(postData)
    if(data){
        return data
    }
}
