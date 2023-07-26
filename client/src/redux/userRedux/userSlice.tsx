import { createSlice } from "@reduxjs/toolkit";

interface initial{
    userName:string,
    darkMode:boolean,
    token:null
}
const initialState:initial = {
    userName:"",
    darkMode:false,
    token:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        changeMode:(state)=>{
            state.darkMode = !state.darkMode
        },
        setUserTheme:(state,action)=>{
            state.darkMode = action.payload
        },
        setUser:(state,action)=>{
            state.userName = action.payload
        },
        setToken:(state,action)=>{
            state.token = action.payload
        }
    }
})

export const {changeMode,setUserTheme,setUser,setToken} = userSlice.actions
export default userSlice.reducer