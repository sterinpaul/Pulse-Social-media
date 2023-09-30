import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onlineUsers : [],
    chatList:[]
}

const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setChatList:(state,action)=>{
            state.chatList = action.payload
        }
    }
})

export const {setOnlineUsers,setChatList} = chatSlice.actions
export default chatSlice.reducer