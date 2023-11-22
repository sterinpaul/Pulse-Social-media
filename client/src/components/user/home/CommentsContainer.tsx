import {
    Dialog,
    Button,
    Radio,
    Typography
  } from "@material-tailwind/react";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid"
import { postData } from "../../../interfaces/postInterface";
import { CLOUDINARY_PROFILE_PHOTO_URL,CLOUDINARY_POST_URL,PROFILE_PHOTO, CLOUDINARY_VIDEO_URL } from "../../../api/baseURL";
import { useState,useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { commentDelete, postComment,updateSinglePost } from "../../../api/apiConnections/postConnection";
import moment from "moment";
import { commentData } from "../../../interfaces/commentInterface";
import SingleComment from "./SingleComment";


interface CommentsContainerProps {
    open: boolean,
    handleOpen: () => void,
    comments:commentData[],
    setComments: any,
    post:postData,
    editStatus: boolean,
    editPostHandle:()=>void,
    handleOpenOptionDialog:(value:string)=>void,
    optionOpenDialog:boolean,
    reportStatus:boolean,
    reportSinglePost:(value:string)=>void,
    deleteSinglePost:()=>void,
    statusToggle:string,
    setOptionOpenDialog:(value:boolean)=>void
}


const CommentsContainer:React.FC<CommentsContainerProps> = ({
    open,
    handleOpen,
    comments,
    setComments,
    post,
    editStatus,
    editPostHandle,
    handleOpenOptionDialog,
    optionOpenDialog,
    reportStatus,
    reportSinglePost,
    deleteSinglePost,
    statusToggle,
    setOptionOpenDialog
})=>{
    const {userName,profilePic,darkMode} = useSelector((store:{user:{userName:string,darkMode:boolean,profilePic:string}})=>store.user)
    const [commentText,setCommentText] = useState('')
    const [replyToUser,setReplyToUser] = useState('')
    const [commentId,setCommentId] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [description,setDescription] = useState(post.description)
    const [selectedReason,setSelectedReason] = useState('')
    const [commentOptionToggle,setCommentOptionToggle] = useState('')
    const [commentOptionDialog,setCommentOptionDialog] = useState(false)
    const navigate = useNavigate()

    const focusTextAreaReply = (commentedUser:string,commentID:string)=>{
        if(textAreaRef.current){
            textAreaRef.current.focus()
            setCommentText(`@${commentedUser} `)
            setReplyToUser(commentedUser)
            setCommentId(commentID)
        }
    }

    const publishComment = async()=>{
        if(commentText.trim().length){
            
            const commentResponse = await postComment(commentText,post?._id,commentId,replyToUser)
            commentResponse.response.profilePic = profilePic
            
            if(commentResponse?.comment){
                setComments((prevComments:[])=>[...prevComments,commentResponse.response])
            }else{
                const replyData = comments.map(data=>{
                    if(data._id === commentId){
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
        
        if(textAreaRef?.current){
            textAreaRef.current.focus()
        }
    }

    const updatePost = async()=>{
        const response = await updateSinglePost(post._id,description)
        if(response?.status===true){
            post.description = description
            handleOpen()
        }
    }

    const handleRadioChange = (event:any)=>{
        setSelectedReason(event.target.value)
    }

    const handleOpenCommentOptionDialog =(option:string,commentId:string)=>{
        setCommentOptionDialog(true)
        setCommentOptionToggle(option)
        setCommentId(commentId)
    }

    const closeCommentOptionDialog = ()=>{
        handleOpen()
        setCommentOptionDialog(false)
        setCommentId('')
    }

    const deleteComment = async()=>{
        handleOpen()
        const response = await commentDelete(commentId)
        if(response.status){
            const commentsAfterDelete = comments.filter(comment=>comment._id !==commentId)
            setComments(commentsAfterDelete)
            setCommentOptionDialog(false)
            setCommentId('')
        }
    }


  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="overflow-hidden max-h-[90vh]"
      >
            <div className="bg-white flex items-center justify-center flex-wrap">
                
                <div className="lg:w-[30rem] md:w-[24rem] sm:w-100 max-h-80 flex items-center justify-center overflow-y-scroll">
                  {post.isVideo ? 
                        (
                        <video muted controls className="m-auto transform-none outline-none">
                            <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/mp4" />
                            <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/mpeg" />
                            <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/ogg" />
                            <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/wmv" />
                            Browser does not support video
                        </video>
                        )
                        : (
                            <img className="w-100 h-100 max-h-96 object-cover" src={CLOUDINARY_POST_URL+(post.imgVideoURL)} alt="Post Image"/>
                        )
                    }
                </div>

                {/* Comment container */}

                <div className="w-[20rem] p-2 m-auto flex flex-col">
                    <div className="flex items-center gap-2 pb-2">
                        <div className="w-10 h-10">
                            <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={post?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+post.profilePic) : PROFILE_PHOTO}/>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div onClick={()=>{navigate(`/${post?.postedUser}`); handleOpen()}} className=" text-black font-bold cursor-pointer" >{post?.postedUser}</div>
                            <p className="text-sm text-blue-gray-500">{moment(post?.createdAt).format('MMMM D YYYY, h:mm a')}</p>
                        </div>


                        {!editStatus ? <div className="relative group">
                            <button className="relative"><EllipsisHorizontalIcon className='w-8 h-8 text-black'/></button>
                            <div className="p-1 w-24 top-5 absolute rounded-md shadow-lg bg-white opacity-0 group-hover:opacity-100">
                                {userName === post?.postedUser ? <>
                                    <button onClick={editPostHandle} className="text-left rounded hover:bg-gray-100 px-1 w-full">Edit</button>
                                    <button onClick={()=>handleOpenOptionDialog('Delete')} className="text-red-900 text-left rounded hover:bg-gray-100 px-1 w-full">Delete</button>
                                </> : reportStatus ? <button className="text-left px-1 w-full" disabled={true}>Reported</button> : <button onClick={()=>handleOpenOptionDialog('Report')} className="text-red-900 rounded hover:bg-gray-100 px-1 w-full">Report</button>}
                            </div>
                        </div> : null}
                        
                        
                    </div>
                    
                    {editStatus ? (
                    <>
                        <div className="overflow-scroll h-44">
                            <textarea onChange={(e)=>setDescription(e.target.value)} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} text-black p-1 focus:outline-none resize-none border-2 border-brown-100 rounded-md outline-gray-400 w-full h-28 mt-4`} value={description}/>
                        </div>
                        <div className="flex gap-4 m-auto">
                            <Button size='sm' onClick={handleOpen} className="mb-2 capitalize w-24">Cancel</Button>
                            <Button size='sm' onClick={updatePost} className="mb-2 capitalize w-24">Update</Button>
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="overflow-scroll max-h-44 h-40">
                            <p>{post.description}</p>
                            {comments?.map((comment)=>{
                            return (
                                <SingleComment key={comment._id} comment={comment} postedUser={post.postedUser} focusTextAreaReply={focusTextAreaReply} handleOpen={handleOpen} handleOpenCommentOptionDialog={handleOpenCommentOptionDialog} />
                                )
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-2 my-1">
                            <div className="w-10 h-10">
                                <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                            </div>

                            <textarea ref={textAreaRef} onChange={(e)=>setCommentText(e.target.value)} value={commentText} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} text-black p-1 focus:outline-none resize-none rounded-md outline-gray-400 placeholder:text-brown-200`} placeholder="Write a comment" />

                            <div>
                                <Button variant="text" size="sm" className="rounded-full p-2" onClick={publishComment}><PaperAirplaneIcon className="w-6 h-6 text-light-blue-800"/></Button>
                            </div>
                        </div>
                    </>
                    )}                    
                </div>
            </div>
      </Dialog>
      
      <Dialog open={optionOpenDialog} size='xs' handler={handleOpenOptionDialog} className="flex justify-center items-center flex-col p-4">
            {statusToggle === 'Delete' ? <>
                <p>Do you really want to delete the post ?</p>
                <div className="flex gap-4 mt-8">
                    <Button onClick={()=>setOptionOpenDialog(false)} size='sm' className="capitalize">Cancel</Button>
                    <Button onClick={deleteSinglePost} size='sm' className="capitalize">Delete</Button>
                </div>
            </> : <>
                <p>Please mention the reason to report the post ?</p>
                <div className="flex flex-col gap-1">
                    <Radio id="false" value='False information' onChange={handleRadioChange} name='reason' defaultChecked label={
                        <Typography color="blue-gray" className="flex font-medium">
                            False information
                        </Typography>}>
                    </Radio>
                    <Radio id="spam" value="It's spam" onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            It's spam
                        </Typography>}>
                    </Radio>
                    <Radio id="scam" value='Scam or fraud' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Scam or fraud
                        </Typography>}>
                    </Radio>
                    <Radio id="sexual" value='Nudity or sexual activity' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Nudity or sexual activity
                        </Typography>}>
                    </Radio>
                    <Radio id="hateSpeech" value='Hate speech or Symbol' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Hate speech or Symbol
                        </Typography>}>
                    </Radio>
                    <Radio id="bullying" value='Bullying or Harassment' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Bullying or Harassment
                        </Typography>}>
                    </Radio>
                        
                    <div className="flex gap-4 mt-4 m-auto">
                        <Button onClick={()=>setOptionOpenDialog(false)} size='sm' className="capitalize">Cancel</Button>
                        <Button onClick={()=>reportSinglePost(selectedReason)} disabled={reportStatus} size='sm' className="capitalize">Report</Button>
                    </div>
                </div>
            </>}
        </Dialog>



        <Dialog open={commentOptionDialog} size='xs' handler={setCommentOptionDialog} className="flex justify-center items-center flex-col p-4">
            {commentOptionToggle === 'Delete' ? <>
                <p>Do you really want to delete the comment ?</p>
                <div className="flex gap-4 mt-8">
                    <Button onClick={closeCommentOptionDialog} size='sm' className="capitalize">Cancel</Button>
                    <Button onClick={deleteComment} size='sm' className="capitalize">Delete</Button>
                </div>
            </> : <>
                <p>Please mention the reason to report the comment ?</p>
                {/* <div className="flex flex-col gap-1">
                    <Radio id="false" value='False information' onChange={handleRadioChange} name='reason' defaultChecked label={
                        <Typography color="blue-gray" className="flex font-medium">
                            False information
                        </Typography>}>
                    </Radio>
                    <Radio id="spam" value="It's spam" onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            It's spam
                        </Typography>}>
                    </Radio>
                    <Radio id="scam" value='Scam or fraud' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Scam or fraud
                        </Typography>}>
                    </Radio>
                    <Radio id="sexual" value='Nudity or sexual activity' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Nudity or sexual activity
                        </Typography>}>
                    </Radio>
                    <Radio id="hateSpeech" value='Hate speech or Symbol' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Hate speech or Symbol
                        </Typography>}>
                    </Radio>
                    <Radio id="bullying" value='Bullying or Harassment' onChange={handleRadioChange} name='reason' label={
                        <Typography color="blue-gray" className="flex font-medium">
                            Bullying or Harassment
                        </Typography>}>
                    </Radio>
                        
                    <div className="flex gap-4 mt-4 m-auto">
                        <Button onClick={()=>setOptionOpenDialog(false)} size='sm' className="capitalize">Cancel</Button>
                        <Button onClick={()=>reportSinglePost(selectedReason)} disabled={reportStatus} size='sm' className="capitalize">Report</Button>
                    </div>
                </div> */}
            </>}
        </Dialog>
    </>
  );
}
export default CommentsContainer