import { useNavigate } from "react-router-dom"
import moment from "moment"
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from "../../../api/baseURL";
import { userInterface } from "../../../interfaces/userInterface";
import { commentData } from "../../../interfaces/commentInterface";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { likeComment } from "../../../api/apiConnections/postConnection";
import SingleReply from "./SingleReply";

interface singleCommentContainer{
    comment:commentData,
    focusTextAreaReply:(commentedUser:string,commentId:string)=>void,
    handleOpen:()=>void
}

const SingleComment:React.FC<singleCommentContainer> = ({comment,focusTextAreaReply,handleOpen})=>{
    const {userName} = useSelector((store:{user:userInterface})=>store.user)
    const likeStatus = comment.liked.includes(userName)
    const [like,setLike] = useState(likeStatus)
    const navigate = useNavigate()

    // Comment like Function
    const commentLikeHandler = async()=>{
        const likeResponse = await likeComment(comment._id)
        
        if(likeResponse?.status){
            if(like){
                comment.liked.splice(comment.liked.indexOf(userName),1)
            }else{
                comment.liked.push(userName)
            }
            setLike(!like)
        }
    }
    const handleReplyClick = ()=>{
        focusTextAreaReply(comment?.commentedUser,comment?._id)
    }

    const goToProfile = ()=>{
        navigate(`/${comment?.commentedUser}`)
        handleOpen()
    }

    return(
        <div>
            <div className="flex justify-center gap-2 p-2">
                <div onClick={goToProfile} className="w-10 h-10 p-1 cursor-pointer">
                    <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={comment?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+(comment.profilePic)) : PROFILE_PHOTO}/>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col justify-center rounded bg-blue-gray-100 p-1">
                        <div onClick={goToProfile} className="text-black font-body cursor-pointer" >{comment?.commentedUser}</div>
                        <p className="text-sm text-black">{comment?.comment}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button onClick={commentLikeHandler} className="relative">
                            {like ? (
                            <><HeartSolid className="h-5 w-5 text-red-700"/>
                                <span className="absolute top-0 left-5 text-xs">{comment?.liked.length}</span>
                            </>
                            ) : (
                                <HeartIcon className="h-5 w-5"/>
                            )}
                        </button>
                        <button onClick={handleReplyClick}>Reply</button>
                        <p className="text-sm text-blue-gray-500">{moment(comment?.createdAt).startOf('minutes').fromNow()}</p>
                    </div>
                </div>
            </div>


            {/* Reply of each Comment */}       
            {comment?.reply?.map((reply:any)=>{
                return(
                    <SingleReply reply={reply} key={reply._id} focusTextAreaReply={focusTextAreaReply}/>
                )
            })}
        </div>
    )
}
export default SingleComment