import { useState } from "react"
import { deleteThePost, getPostComments, reportThePost } from "../../../api/apiConnections/postConnection"
import { CLOUDINARY_POST_URL, CLOUDINARY_VIDEO_URL } from "../../../api/baseURL"
import CommentsContainer from "../home/CommentsContainer"
import { commentData } from "../../../interfaces/commentInterface"
import { postData } from "../../../interfaces/postInterface"
import { useSelector } from "react-redux"


interface singlePostInterface{
    post:postData
}

const SinglePostPhoto:React.FC<singlePostInterface> = ({post})=>{
    const {userName} = useSelector((store:{user:{userName:string,darkMode:boolean,profilePic:string}})=>store.user)
    const [open, setOpen] = useState(false)
    const [comments,setComments] = useState<commentData[]>([])
    const [editStatus,setEditStatus] = useState(false)
    const reportedStatus = post?.reports?.some((user)=>user.userName === userName)
    const [reportStatus,setReportStatus] = useState(reportedStatus)
    const [optionOpenDialog,setOptionOpenDialog] = useState(false)
    const [statusToggle,setStatusToggle] = useState('')
    

    const handleOpen = () => setOpen((cur) => !cur)

    const getComments = async()=>{
        setEditStatus(false)
        handleOpen()
        const commentsResponse = await getPostComments(post?._id)
        setComments(commentsResponse)
    }

    const handleOpenOptionDialog = (value:string)=>{
        setStatusToggle(value)
        setOptionOpenDialog(!optionOpenDialog)
    }

    const editPostHandle = ()=>{
        setEditStatus(true)
        setOpen(true)
    }
    
    const deleteSinglePost = async()=>{
        const response = await deleteThePost(post._id)
        if(response){
            post.listed = false
            setOptionOpenDialog(false)
        }
    }

    const reportSinglePost = async(selectedReason:string)=>{
        setReportStatus(!reportStatus)
        const response = await reportThePost(post._id,selectedReason)
        if(response.status){
            setOptionOpenDialog(false)
        }
    }

    return (
        <>
            <div onClick={getComments} className="w-full h-full">
                {post.isVideo ? 
                    (
                    <video muted className="m-auto transform-none outline-none">
                        <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/mp4" />
                        <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/mpeg" />
                        <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/ogg" />
                        <source src={CLOUDINARY_VIDEO_URL+(post.imgVideoURL)} type="video/wmv" />
                        Browser does not support video
                    </video>
                    )
                    : (
                        <img className="w-full h-full object-cover" src={CLOUDINARY_POST_URL+(post.imgVideoURL)} alt="Post Image"/>
                    )
                }
            </div>
 
            <CommentsContainer
            open={open}
            handleOpen={handleOpen}
            post={post}
            comments={comments}
            setComments={setComments}
            editStatus={editStatus}
            editPostHandle={editPostHandle}
            handleOpenOptionDialog={handleOpenOptionDialog}
            optionOpenDialog={optionOpenDialog}
            reportStatus={reportStatus}
            reportSinglePost={reportSinglePost}
            deleteSinglePost={deleteSinglePost}
            statusToggle={statusToggle}
            setOptionOpenDialog={setOptionOpenDialog}
            />
        </>
    )
}

export default SinglePostPhoto