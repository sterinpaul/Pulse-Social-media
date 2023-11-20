export interface userInterface{
    userName:string,
    userId:string,
    darkMode:boolean,
    profilePic:string,
    notifications:[NotificationInterface],
    savedPosts:string[]
}

export interface userProfile{
    _id: string,
    userName: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    mobile?:string,
    isBlocked: boolean,
    darkMode?: boolean,
    profilePic?: string,
    gender?: string,
    city?: string,
    bio?:string,
    notifications?:[],
    followRequested?: [],
    followRequests?: [],
    followers?: string[],
    following?: string[],
    savedPosts:string[],
    createdAt?: string,
    updatedAt?: string,
    posts?: object[]
    chatId?:string
}

export interface chattedUsers{
    _id:string,
    userName:string,
    chatId?:string,
    firstName:string,
    lastName:string,
    profilePic:string
}

export interface onlineUsersInterface{
    userId:string,
    socketId:string
}

export interface NotificationInterface{
    _id:string,
    user:string,
    type:string,
    followerId?:string,
    profilePic?:string,
    createdAt:string
}