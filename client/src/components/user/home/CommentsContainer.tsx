import {
  Button,
  Dialog,
//   Card
} from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid"
import { postData } from "../../../interfaces/postInterface";
import { CLOUDINARY_PROFILE_PHOTO_URL,CLOUDINARY_POST_URL,PROFILE_PHOTO } from "../../../api/baseURL";
import { useState,useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { postComment } from "../../../api/apiConnections/postConnection";
import moment from "moment";
import { commentData } from "../../../interfaces/commentInterface";
import SingleComment from "./SingleComment";


interface CommentsContainerProps {
    open: boolean,
    handleOpen: () => void,
    comments:commentData[],
    setComments: any,
    post:postData
}


const CommentsContainer:React.FC<CommentsContainerProps> = ({open,handleOpen,comments,setComments,post})=>{
    const {profilePic,darkMode} = useSelector((store:{user:{userName:string,darkMode:boolean,profilePic:string}})=>store.user)
    const [commentText,setCommentText] = useState('')
    const [commentId,setCommentId] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    
    const focusTextAreaReply = (commentedUser:string,commentID:string)=>{
        if(textAreaRef.current){
            textAreaRef.current.focus()
            setCommentText(`@${commentedUser} `)
            setCommentId(commentID)
        }
    }

    const publishComment = async()=>{
        if(commentText.trim().length){
            const commentResponse = await postComment(commentText,post?._id,commentId)
            commentResponse.response.profilePic = profilePic
            
            if(commentResponse?.comment){
                setComments((prevComments:[])=>[commentResponse.response,...prevComments])
            }else{
                const replyData = comments.map(data=>{
                    if(data._id===commentId){
                        return{
                            ...data,reply:[...data.reply,commentResponse.response]
                        }
                    }
                    return data
                })
                setComments(replyData)
            }
            setCommentText('')
        }
    }


  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="overflow-scroll"
      >
        {/* <Card className=""> */}
            <div className="bg-white flex items-center justify-center flex-wrap">
                {post?.imgVideoURL ? (
                    <div className="lg:w-[30rem] md:w-[24rem] sm:w-96 flex items-center justify-center ">
                      <img className="w-fill h-fill max-h-96" src={CLOUDINARY_POST_URL+post.imgVideoURL} alt='post'/>
                    </div>
                    ) : null
                }

                {/* Comment container */}

                <div className="w-[20rem] p-1 m-auto flex flex-col">
                    <div className="flex items-center pl-4 gap-2">
                        <div className="w-10 h-10">
                            <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={post?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+post.profilePic) : PROFILE_PHOTO}/>
                        </div>
                        <div className="flex flex-col justify-center">
                            <Link to={`/${post?.postedUser}`} className=" text-black font-bold" >{post?.postedUser}</Link>
                            <p className="text-sm text-blue-gray-500">{moment(post?.createdAt).format('MMMM D YYYY, h:mm a')}</p>
                        </div>
                    </div>
                    <div className="overflow-scroll h-44">
                        
                        <p className="m-2">{post?.description}</p>

                        {/* Single Comment */}
                        {/* <div className="overflow-scroll p-2 h-[calc(100vh-38rem)] lg:h-[calc(100vh-20rem)]"> */}
                            
                        {comments?.map((comment)=>{
                            return (
                                <SingleComment comment={comment} key={comment._id} focusTextAreaReply={focusTextAreaReply}/>
                            )
                        })}
                        
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-10 h-10">
                            <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                        </div>

                        <textarea ref={textAreaRef} onChange={(e)=>setCommentText(e?.target?.value)} value={commentText} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} text-black p-1 focus:outline-none resize-none rounded-md outline-gray-400 placeholder:text-brown-200`} placeholder="Write a comment" />

                        <div>
                            <Button variant="text" size="sm" className="rounded-full p-2" onClick={publishComment}><PaperAirplaneIcon className="w-6 h-6 text-light-blue-800"/></Button>
                        </div>
                    </div>
                </div>
            </div>
        {/* </Card> */}
      </Dialog>
    </>
  );
}
export default CommentsContainer