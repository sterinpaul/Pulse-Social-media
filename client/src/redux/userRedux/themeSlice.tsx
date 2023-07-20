import { createSlice } from "@reduxjs/toolkit";

interface initial{
    darkMode:Boolean
}
const initialState:initial = {
    darkMode:false
}

const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeMode:(state)=>{
            state.darkMode = !state.darkMode
        }
    }
})

export const {changeMode} = themeSlice.actions
export default themeSlice.reducer