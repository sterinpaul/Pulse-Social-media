import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userRedux/userSlice";
import adminSlice from "./adminRedux/adminSlice";
import chatSlice from "./userRedux/chatSlice";


const store = configureStore({
    reducer:{
        user:userSlice,
        admin:adminSlice,
        chat:chatSlice
    }
})

export default store