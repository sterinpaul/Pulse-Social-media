import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from 'moment'
import {HandThumbUpIcon,ChatBubbleLeftRightIcon,ShareIcon,BookmarkIcon,EllipsisHorizontalIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as HandThumbUpSolidIcon,BookmarkIcon as BookmarkIconSolid} from "@heroicons/react/20/solid";
import { CLOUDINARY_PROFILE_PHOTO_URL,CLOUDINARY_POST_URL,PROFILE_PHOTO } from "../../../api/baseURL";
import { likePost,unlikePost } from "../../../api/apiConnections/postConnection";
import CommentsContainer from "./CommentsContainer";
import { postData } from "../../../interfaces/postInterface";
import { commentData } from "../../../interfaces/commentInterface";
import { userInterface } from "../../../interfaces/userInterface";
import { getPostComments,deleteThePost,reportThePost } from "../../../api/apiConnections/postConnection";
import { saveHandler } from "../../../api/apiConnections/userConnection";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Dialog,
    Button,
    Radio,
    Typography
  } from "@material-tailwind/react";


interface UserBodyProps {
    post: postData
    userData: userInterface
    deletePost:(postId:string)=>void
}


const UserBodyPost:React.FC<UserBodyProps> = ({post,userData,deletePost})=>{
    const [open, setOpen] = useState(false)
    const {userName,darkMode} = useSelector((store:{user:userInterface})=>store.user)
    const likeStatus = post.liked.includes(userName)
    const [like,setLike] = useState(likeStatus)
    const [comments,setComments] = useState<commentData[]>([])
    const savedStatus = userData?.savedPosts?.includes(post._id)
    const [savedPost,setSavedPost] = useState(savedStatus)
    const [optionOpenDialog,setOptionOpenDialog] = useState(false)
    const [statusToggle,setStatusToggle] = useState('')
    const reportedStatus = post?.reports?.some((user)=>user.userName === userName)
    const [reportStatus,setReportStatus] = useState(reportedStatus)
    const [selectedReason,setSelectedReason] = useState('')
    const [editStatus,setEditStatus] = useState(false)

    const likeHandler = async()=>{
        if(like){
            await unlikePost(post._id).then(()=>post.liked.splice(post.liked.indexOf(userName),1))
        }else{
            await likePost(post._id).then(()=>post.liked.push(userName))
        }
        setLike(!like)
    }

    const getComments = async()=>{
        setEditStatus(false)
        handleOpen()
        const commentsResponse = await getPostComments(post?._id)
        setComments(commentsResponse)
    }

    const savePostHandler = async()=>{
        const response = await saveHandler(post?._id)
        if(response?.status){
            setSavedPost(!savedPost)
        }
    }

    const handleOpen = () => setOpen((cur) => !cur)

    const editPostHandle = ()=>{
        setEditStatus(true)
        handleOpen()

    }

    const handleOpenOptionDialog = (value:string)=>{
        setStatusToggle(value)
        setOptionOpenDialog(!optionOpenDialog)
    }

    const deleteSinglePost = async()=>{
        const response = await deleteThePost(post._id)
        if(response){
            deletePost(post._id)
        }
    }

    const handleRadioChange = (event:any)=>{
        setSelectedReason(event.target.value)
    }


    const reportSinglePost = async()=>{
        setReportStatus(!reportStatus)
        const response = await reportThePost(post._id,selectedReason)
        if(response.status){
            setOptionOpenDialog(false)
        }
    }


    return (
        <div className={`${darkMode ? "bg-blue-gray-200" : "bg-white"} h-max shadow-xl w-[calc(100vw-1rem)] p-4 shadow-blue-gray mt-4 rounded lg:w-[calc(100vw-33rem)]`}>
            <div className="flex flex-col">
                <div className="flex gap-3 items-center pb-2">
                    <div className="w-10 h-10">
                        <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={post?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+(post.profilePic)) : PROFILE_PHOTO}/>
                    </div>
                    <div>
                        <Link to={`/${post?.postedUser}`} className="text-gray-800" >{post?.postedUser}</Link>
                        <p className="text-sm text-blue-gray-500">Published: {moment(post?.createdAt).format('MMMM D YYYY, h:mm a')}</p>
                    </div>


                    {/* Options menu of post */}
                    <Menu placement="bottom-end">
                        <MenuHandler className="ml-auto mb-auto">
                            <button><EllipsisHorizontalIcon className='w-8 h-8'/></button>
                        </MenuHandler>
                        <MenuList className="flex flex-col gap-1 p-1 -z-1">
                            {userName === post?.postedUser ? <>
                                <MenuItem onClick={editPostHandle}>Edit</MenuItem>
                                <MenuItem onClick={()=>handleOpenOptionDialog('Delete')} className="text-red-900">Delete</MenuItem>
                            </> : reportStatus ? <MenuItem disabled={true}>Reported</MenuItem> : <MenuItem onClick={()=>handleOpenOptionDialog('Report')} className="text-red-900">Report</MenuItem>}
                        </MenuList>
                    </Menu>
                    
                    <Dialog open={optionOpenDialog} size='xs' handler={handleOpenOptionDialog} className="flex justify-center items-center flex-col p-4">
                        {statusToggle === 'Delete' ? <>
                            <p>Do you really want to delete the post ?</p>
                            <div className="flex gap-4 mt-8">
                                <Button onClick={()=>handleOpenOptionDialog('')} size='sm' className="capitalize">Cancel</Button>
                                <Button onClick={deleteSinglePost} size='sm' className="capitalize">Delete</Button>
                            </div>
                        </> : <>
                            <p>Please mention the reason to report the post ?</p>
                            <div className="flex flex-col gap-1">
                                <Radio value='False information' onChange={handleRadioChange} name='reason' defaultChecked label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        False information
                                    </Typography>}>
                                </Radio>
                                <Radio value="It's spam" onChange={handleRadioChange} name='reason' label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        It's spam
                                    </Typography>}>
                                </Radio>
                                <Radio value='Scam or fraud' onChange={handleRadioChange} name='reason' label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        Scam or fraud
                                    </Typography>}>
                                </Radio>
                                <Radio value='Nudity or sexual activity' onChange={handleRadioChange} name='reason' label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        Nudity or sexual activity
                                    </Typography>}>
                                </Radio>
                                <Radio value='Hate speech or Symbol' onChange={handleRadioChange} name='reason' label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        Hate speech or Symbol
                                    </Typography>}>
                                </Radio>
                                <Radio value='Bullying or Harassment' onChange={handleRadioChange} name='reason' label={
                                    <Typography color="blue-gray" className="flex font-medium">
                                        Bullying or Harassment
                                    </Typography>}>
                                </Radio>
                                    
                                <div className="flex gap-4 mt-4 m-auto">
                                    <Button onClick={()=>handleOpenOptionDialog('')} size='sm' className="capitalize">Cancel</Button>
                                    <Button onClick={reportSinglePost} disabled={reportStatus} size='sm' className="capitalize">Report</Button>
                                </div>
                            </div>
                        </>}
                    </Dialog>
                </div>
                <div>
                    <img className="m-auto" src={CLOUDINARY_POST_URL+(post?.imgVideoURL)} alt="post"/>
                </div>
                <div className="flex gap-5 w-fill h-16">
                    <button className="relative" onClick={()=>likeHandler()}>{like ? <HandThumbUpSolidIcon className="h-8 w-8"/> : <HandThumbUpIcon className="h-8 w-8"/>}{post.liked.length ? <span className="absolute top-1 left-6 text-xs text-white bg-blue-gray-800 w-4 rounded-full">{post.liked.length}</span> : null}</button>
                    <button onClick={getComments}><ChatBubbleLeftRightIcon className="h-8 w-8"/></button>
                    <button><ShareIcon className="h-8 w-8"/></button>
                    <button onClick={savePostHandler}>{savedPost ? <BookmarkIconSolid className="h-8 w-8"/> : <BookmarkIcon className="h-8 w-8"/>}</button>
                </div>
                
                <p>{post.description}</p>
                
                <CommentsContainer editStatus={editStatus} open={open} handleOpen={handleOpen} post={post} comments={comments} setComments={setComments} />
            </div>
        </div>
    )
}

export default UserBodyPost