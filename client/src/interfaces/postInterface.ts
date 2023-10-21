export interface postData{
    _id:string,
    description:string,
    imgVideoURL:string,
    listed:boolean,
    liked:string[],
    postedUser:string,
    profilePic?:string,
    createdAt:string,
    updatedAt:string,
    reports:[{
        userName:string,
        reason:string
    }]
}