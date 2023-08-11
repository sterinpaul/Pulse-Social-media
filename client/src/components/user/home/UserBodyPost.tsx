import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from 'moment'
import {HandThumbUpIcon,ChatBubbleLeftRightIcon,ShareIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as HandThumbUpSolidIcon} from "@heroicons/react/20/solid";
import { CLOUDINARY_PROFILE_PHOTO_URL,CLOUDINARY_POST_URL,PROFILE_PHOTO } from "../../../api/baseURL";

interface userInterface{
    userName:string,
    userId:string,
    darkMode:boolean,
    profilePic:string
}

const UserBodyPost = ({...post})=>{
    
    const {userName,darkMode,profilePic} = useSelector((store:{user:userInterface})=>store.user)
    
    const likeStatus = post.liked.some((person:string)=>person===userName)
    const [like,setLike] = useState(likeStatus)

    const likeHandler = ()=>{
        if(like){
            post.liked.splice(post.liked.indexOf(userName),1)
        }else{
            post.liked.push(userName)
        }
        setLike(!like)
    }

    return (
        <div className={`${darkMode ? "bg-blue-gray-200" : "bg-white"} h-max shadow-xl w-[calc(100vw-1rem)] p-4 shadow-blue-gray mt-4 rounded lg:w-[calc(100vw-33rem)]`}>
            <div className="flex flex-col">
                <div className="flex gap-3 items-center pb-2">
                    <div className="w-10 h-10">
                        <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                    </div>
                    <div>
                        <Link to={`/${post?.postedUser}`} className="text-gray-800" >{post?.postedUser}</Link>
                        <p className="text-sm text-blue-gray-500">Published: {moment(post?.createdAt).format('MMMM D YYYY, h:mm a')}</p>
                    </div>
                </div>
                <div className="m-auto">
                    {post.imgVideoURL ? <img src={CLOUDINARY_POST_URL+(post?.imgVideoURL)} alt="post"/> : <p>{post?.description}</p>}
                    
                </div>
                <div className="flex gap-5 w-fill h-16">
                    <button className="relative" onClick={()=>likeHandler()}>{like ? <HandThumbUpSolidIcon className="h-8 w-8"/> : <HandThumbUpIcon className="h-8 w-8"/>}{post.liked.length ? <span className="absolute top-1 left-6 text-xs text-white bg-blue-gray-800 w-4 rounded-full">{post.liked.length}</span> : null}</button>
                    <button><ChatBubbleLeftRightIcon className="h-8 w-8"/></button>
                    <button><ShareIcon className="h-8 w-8"/></button>
                </div>
                {post.imgVideoURL ? <p>{post.description}</p>: null}
            </div>
        </div>
    )
}

export default UserBodyPost