import { createSlice } from "@reduxjs/toolkit";

interface receivedMessageInterface{
  _id: string,
  chatId: string,
  message: string,
  receiverId: string,
  senderId: string
}

const initialState = {
    onlineUsers : [],
    chatList: [],
    receivedMessages: [] as receivedMessageInterface[],
    userChatId:''
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
        },
        setReceivedMessages:(state,action)=>{
            state.receivedMessages = [...state.receivedMessages,action.payload]
        },
        clearReceivedMessages:(state)=>{
            state.receivedMessages = []
        },
        setUserChatId:(state,action)=>{
            state.userChatId = action.payload
        }
    }
})

export const {setOnlineUsers,setChatList,setReceivedMessages,clearReceivedMessages,setUserChatId} = chatSlice.actions
export default chatSlice.reducer