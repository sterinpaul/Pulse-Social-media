import { postRepositoryMongoDB } from "../../framework/database/mongoDB/repositories/postHelperRepositories";

export const postDbRepository = (repository:ReturnType<postRepositoryMongoDB>)=>{

    const getAllPost = ()=>{
        return repository.getPost()
    }

    const addPost = async(post:{
        postedUser: string,
        description: string,
        imgVideoURL: string
    })=>{
        return await repository.addPost(post)
    }

    return {
        getAllPost,
        addPost
    }
}
export type postDbInterface = typeof postDbRepository

