import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import postRouter from './post'
import chatRouter from "./chat";
import messageRouter from "./message";
import userMiddleware from "../middlewares/authMiddlewares";
import adminAuthRouter from "./adminAuth";
import adminRouter from "./admin";

const routes = (app:Application)=>{
    app.use('/api/auth',authRouter())
    app.use('/api/adminauth',adminAuthRouter())
    app.use('/api/user',userMiddleware,userRouter())
    app.use('/api/admin',userMiddleware,adminRouter())
    app.use('/api/post',userMiddleware,postRouter())
    app.use('/api/chat',userMiddleware,chatRouter())
    app.use('/api/message',userMiddleware,messageRouter())
}

export default routes