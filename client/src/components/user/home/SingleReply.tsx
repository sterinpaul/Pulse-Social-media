import { Link } from "react-router-dom"
import { CLOUDINARY_PROFILE_PHOTO_URL,PROFILE_PHOTO } from "../../../api/baseURL"
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { userInterface } from "../../../interfaces/userInterface";
import { replyData } from "../../../interfaces/commentInterface";
import { useState } from "react";
import moment from "moment";
import { likeReply } from "../../../api/apiConnections/postConnection";

interface singleReplyContainer{
    reply:replyData,
    focusTextAreaReply:(commentedUser:string,commentId:string)=>void
}

const SingleReply:React.FC<singleReplyContainer> = ({reply,focusTextAreaReply})=>{
    const {userName} = useSelector((store:{user:userInterface})=>store.user)
    console.log('repl.....',reply);
    
    const likeStatus = reply.liked.includes(userName)
    const [like,setLike] = useState(likeStatus)

    

     // Reply like Function
     const commentLikeHandler = async()=>{
        const likeResponse = await likeReply(reply._id)
        if(likeResponse?.status){
            if(like){
                reply.liked.splice(reply.liked.indexOf(userName),1)
            }else{
                reply.liked.push(userName)
            }
            setLike(!like)
        }
    }
    const handleReplyClick = ()=>{
        focusTextAreaReply(reply?.commentedUser,reply?._id)
    }

    return(
        <div className="pl-16 flex justify-center gap-2 p-2">
            <Link to={`/${reply?.commentedUser}`} className="w-10 h-10 p-1">
                <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={reply?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+(reply.profilePic)) : PROFILE_PHOTO}/>
            </Link>
            <div className="flex flex-col">
                <div className="flex flex-col justify-center rounded bg-blue-gray-100 p-1">
                    <Link to={`/${reply?.commentedUser}`} className="text-black font-body" >{reply?.commentedUser}</Link>
                    <p className="text-sm text-black">{reply?.comment}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={commentLikeHandler} className="relative">
                        {like ? (
                        <><HeartSolid className="h-5 w-5 text-red-700"/>
                            <span className="absolute top-0 left-5 text-xs">{reply?.liked.length}</span>
                        </>
                        ) : (
                            <HeartIcon className="h-5 w-5"/>
                        )}
                    </button>
                    <button onClick={handleReplyClick}>Reply</button>
                    <p className="text-sm text-blue-gray-500">{moment(reply?.createdAt).startOf('minutes').fromNow()}</p>
                </div>
            </div>
        </div>
    )
}

export default SingleReply