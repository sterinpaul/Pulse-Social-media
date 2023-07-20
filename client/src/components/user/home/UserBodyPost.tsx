import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from 'moment'
import {HandThumbUpIcon,ChatBubbleLeftRightIcon,ShareIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as HandThumbUpSolidIcon} from "@heroicons/react/20/solid";


const UserBodyPost = ({...post})=>{
    
    const userId:string = "1"
    const userName:string = "Sterin Paul"
    const themeDark:Boolean = useSelector((store:{theme:{darkMode:Boolean}})=>store.theme.darkMode)
    const likeStatus = post.liked.some((person:{id:string})=>person.id===userId)
    const [like,setLike] = useState(likeStatus)

    const likeHandler = ()=>{
        if(like){
            post.liked.splice(post.liked.indexOf((person:{id:string})=>person.id===userId),1)
        }else{
            post.liked.push({
                id:userId,
                userName:userName
            })
        }
        setLike(!like)
    }

    return (
        <div className={`${themeDark ? "bg-blue-gray-200" : "bg-white"} h-max shadow-xl w-[calc(100vw-1rem)] p-4 shadow-blue-gray mt-4 rounded lg:w-[calc(100vw-33rem)]`}>
            <div className="flex flex-col">
                <div className="flex gap-3 items-center pb-2">
                    <div>
                        <img className="w-10 h-10 rounded-full outline outline-1 outline-gray-600" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"/>
                    </div>
                    <div>
                        <Link to="/profile">{post.userName}</Link>
                        <p className="text-sm text-blue-gray-500">Published: {moment(post.createdAt).format('MMMM D YYYY, h:mm a')}</p>
                    </div>
                </div>
                <div>
                    {post.img ? <img src={URL.createObjectURL(post.img)} alt="post"/> : <p>{post.text}</p>}
                    
                    <div className="flex gap-5 w-fill h-16">
                        <button className="relative" onClick={()=>likeHandler()}>{like ? <HandThumbUpSolidIcon className="h-8 w-8"/> : <HandThumbUpIcon className="h-8 w-8"/>}{post.liked.length ? <span className="absolute top-1 left-6 text-xs text-white bg-blue-gray-800 w-4 rounded-full">{post.liked.length}</span> : null}</button>
                        <button><ChatBubbleLeftRightIcon className="h-8 w-8"/></button>
                        <button><ShareIcon className="h-8 w-8"/></button>
                    </div>
                </div>
                {post.img ? <p>{post.text}</p>: null}
            </div>
        </div>
    )
}

export default UserBodyPost