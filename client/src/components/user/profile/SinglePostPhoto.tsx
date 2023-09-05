import { useState } from "react"
import { getPostComments } from "../../../api/apiConnections/postConnection"
import { CLOUDINARY_POST_URL } from "../../../api/baseURL"
import CommentsContainer from "../home/CommentsContainer"
import { commentData } from "../../../interfaces/commentInterface"

const SinglePostPhoto = ({post}:any)=>{
    const [open, setOpen] = useState(false)
    const [comments,setComments] = useState<commentData[]>([])
    const handleOpen = () => setOpen((cur) => !cur)

    const getComments = async()=>{
        handleOpen()
        const commentsResponse = await getPostComments(post?._id)
        setComments(commentsResponse)
    }
    

    return (
        <>
            <div onClick={getComments} >
                <img className="w-100 h-100 object-cover" src={CLOUDINARY_POST_URL+post?.imgVideoURL} alt="Posted Image"></img>
            </div>
            <CommentsContainer open={open} handleOpen={handleOpen} post={post} comments={comments} setComments={setComments} />
        </>
    )
}

export default SinglePostPhoto