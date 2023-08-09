import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocal = ()=>{
    const userData = localStorage.getItem("user")
    if(userData){
        const user = JSON.parse(userData)
        return user
    }else{
        const user = {
            _id:"",
            token:"",
            userName: "",
            darkMode: false,
            profilePic: ""
        }
        return user
    }
}

interface initial{
    reduxUser : {
        _id?:string,
        token?:string,
        userName?: string,
        darkMode?: boolean,
        profilePic?: string,
        // firstName?: string,
        // lastName?: string,
        // email?: string,
        // mobile?: string,
        // isBlocked?: boolean,
        // gender?: string,
        // city?: string,
        // bio?:string,
        // savedPosts?:object[],
        // blockedByUsers?: object[],
        // blockedUsers?: object[],
        // followRequested?: object[],
        // followRequests?: object[],
        // followers?: object[],
        // following?: object[],
        // createdAt?: string,
        // updatedAt?: string
    }
}

const initialState:initial = {
    reduxUser:getTokenFromLocal()
    // reduxUser : {
        // _id:"",
        // token:"",
        // userName: "",
        // darkMode: false,
        // profilePic: "",
        // firstName: "",
        // lastName: "",
        // email: "",
        // mobile?: "",
        // isBlocked: false,
        // gender: "",
        // city: "",
        // bio:"",
        // savedPosts: [],
        // blockedByUsers: [],
        // blockedUsers: [],
        // followRequested: [],
        // followRequests: [],
        // followers: [],
        // following: [],
        // createdAt: "",
        // updatedAt: ""
    // }
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        changeMode:(state)=>{
            state.reduxUser.darkMode = !state.reduxUser.darkMode
        },
        setUser:(state,action)=>{
            state.reduxUser = action.payload
        },
        changePhoto:(state,action)=>{
            state.reduxUser.profilePic = action.payload
        },
        userSignOut:(state)=>{
            localStorage.removeItem("user")
            state.reduxUser = {...initialState.reduxUser}
        }
    }
})

export const {changeMode,setUser,changePhoto,userSignOut} = userSlice.actions
export default userSlice.reducer