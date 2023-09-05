export interface commentData{
    _id:string,
    commentedUser:string,
    profilePic:string,
    postId:string,
    comment:string,
    liked:string[],
    reply:object[],
    createdAt:string,
    updatedAt:string
}

export interface replyData{
    _id:string,
    commentedUser:string,
    profilePic:string,
    comment:string,
    liked:string[],
    createdAt:string
}