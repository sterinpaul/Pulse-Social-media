export interface userInterface{
    userName:string,
    userId:string,
    darkMode:boolean,
    profilePic:string,
    savedPosts:string[]
}

export interface userProfile{
    _id: string | null | undefined
    userName: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    isBlock?: boolean,
    darkMode?: boolean,
    profilePic?: string,
    gender?: string,
    city?: string,
    bio?:string,
    blockedByUsers?: [],
    blockedUsers?: [],
    followRequested?: [],
    followRequests?: [],
    followers?: string[],
    following?: string[],
    savedPosts:object[],
    createdAt?: string,
    updatedAt?: string,
    posts?: object[]
}