import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocal = ()=>{
    const token = localStorage.getItem("admin-token")
    if(token){
        return token
    }else{
        return ''
    }
}


interface initial{
    adminToken?:string,
    notifications?:[]
}

const initialState:initial = {
    adminToken: getTokenFromLocal(),
    notifications:[]
}

const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{
        setAdminToken:(state,action)=>{
            state.adminToken = action.payload
            localStorage.setItem('admin-token',action.payload)
        },
        adminSignOut:(state)=>{
            state.adminToken = ''
            localStorage.removeItem('admin-token')
        },
        clearOpenedNotification:(state,action)=>{
            state.notifications?.splice(action.payload.index,1)
        },
        clearNotifications:(state)=>{
            state.notifications = []
        }
    }
})

export const {setAdminToken,adminSignOut,clearOpenedNotification,clearNotifications} = adminSlice.actions
export default adminSlice.reducer