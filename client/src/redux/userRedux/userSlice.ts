import { createSlice } from "@reduxjs/toolkit";


const getTokenFromLocal = ()=>{
    const token = localStorage.getItem("token")
    if(token){
        return token
    }
}
const getUserNameFromLocal = ()=>{
    const userName = localStorage.getItem("userName")
    if(userName){
        return userName
    }
}
const getDarkModeFromLocal = ()=>{
    const darkMode = localStorage.getItem("darkMode")
    if(darkMode){
        return JSON.parse(darkMode)
    }
}
const getProfilePicFromLocal = ()=>{
    const profilePic = localStorage.getItem("profilePic")
    if(profilePic){
        return profilePic
    }
}
const getUserIdFromLocal = ()=>{
    const _id = localStorage.getItem('id')
    if(_id) return _id
}

interface initial{
    token?:string,
    userName?: string,
    darkMode?: boolean,
    profilePic?: string,
    userId?:string,
    follow?:boolean,
    followNotification:{},
    notifications?:[]
}

const initialState:initial = {
    token: getTokenFromLocal(),
    userName: getUserNameFromLocal(),
    darkMode: getDarkModeFromLocal(),
    profilePic: getProfilePicFromLocal(),
    userId: getUserIdFromLocal(),
    follow:false,
    followNotification:{},
    notifications:[]
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        changeMode:(state)=>{
            state.darkMode = !state.darkMode
        },
        setToken:(state,action)=>{
            state.token = action.payload
            localStorage.setItem('token',action.payload)
        },
        setUserName:(state,action)=>{
            state.userName = action.payload
            localStorage.setItem('userName',action.payload)
        },
        setUser:(state,action)=>{
            state.userName = action.payload.userName
            state.userId = action.payload._id
            state.darkMode = action.payload.darkMode
            state.profilePic = action.payload.profilePic
            localStorage.setItem('userName',action.payload.userName)
            localStorage.setItem('id',action.payload._id)
            localStorage.setItem('darkMode',action.payload.darkMode)
            localStorage.setItem('profilePic',action.payload.profilePic)
        },
        changePhoto:(state,action)=>{
            state.profilePic = action.payload
            localStorage.setItem('profilePic',action.payload)
        },
        userSignOut:(state)=>{
            state.token = ''
            state.userName = ''
            state.userId = ''
            state.darkMode = false
            state.profilePic = ''
            localStorage.removeItem('token')
            localStorage.removeItem('userName')
            localStorage.removeItem('id')
            localStorage.removeItem('darkMode')
            localStorage.removeItem('profilePic')
        },
        setNotifications:(state,action)=>{
            state.notifications = action.payload
        },
        setFollow:(state,action)=>{
            state.follow = action.payload
        },
        setFollowNotification:(state,action)=>{
            state.followNotification = action.payload
        },
        clearOpenedNotification:(state,action)=>{
            state.notifications?.splice(action.payload.index,1)
        },
        clearNotifications:(state)=>{
            state.notifications = []
        }
    }
})

export const {
    changeMode,
    setToken,
    setUserName,
    setUser,
    changePhoto,
    userSignOut,
    setNotifications,
    clearOpenedNotification,
    setFollow,
    setFollowNotification,
    clearNotifications
} = userSlice.actions

export default userSlice.reducer