export interface postData{
    _id:string,
    description?:string,
    imgVideoURL?:string,
    isBlocked:boolean,
    liked:string[],
    postedUser:string,
    profilePic:string,
    createdAt:string,
    updatedAt:string,
    reports:string[]
}