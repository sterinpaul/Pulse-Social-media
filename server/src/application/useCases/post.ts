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
    postedUser: string,
    description: string,
    imgVideoURL: string,
    postRepository:ReturnType<postDbInterface>,
)=>{
    const post = {
        postedUser,
        description,
        imgVideoURL
    }

    const data = await postRepository.addPost(post)
    if(data){
        return data
    }
}
