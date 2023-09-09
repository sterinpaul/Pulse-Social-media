export interface postData{
    _id:string,
    description:string,
    imgVideoURL:string,
    liked:string[],
    postedUser:string,
    profilePic:string,
    createdAt:string,
    updatedAt:string,
    reports:[{
        userName:string,
        reason:string
    }]
}