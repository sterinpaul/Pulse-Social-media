import Post from "../models/postModel"

interface postInterface{
    postedUser: string,
    description: string,
    imgVideoURL: string
}

export const postRepositoryMongoDB = ()=>{

    const getPost = async()=>{
        return await Post.find({isBlocked:false}).sort({createdAt:-1})
    }

    const addPost = async(post:postInterface)=>{
        const newPost = new Post(post)
        return await newPost.save()
    }


    return {
        getPost,
        addPost
    }
}

export type postRepositoryMongoDB = typeof postRepositoryMongoDB