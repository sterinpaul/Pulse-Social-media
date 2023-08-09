import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import postRouter from './post'
import userMiddleware from "../middlewares/authMiddlewares";

const routes = (app:Application)=>{
    app.use('/api/auth',authRouter()),
    app.use('/api/user',userMiddleware,userRouter())
    app.use('/api/post',userMiddleware,postRouter())
}

export default routes