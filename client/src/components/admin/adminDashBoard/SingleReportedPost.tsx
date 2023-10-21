import { Button, Typography } from "@material-tailwind/react"
import { postData } from "../../../interfaces/postInterface"
import { CLOUDINARY_POST_URL } from "../../../api/baseURL"
import { useState } from "react"
import { postBlockhandler } from "../../../api/apiConnections/adminConnection"

interface SinglePostReport{
    post:postData,
    setOpenUserDialog:(report:[{userName:string,reason:string}])=>void
}

const SingleReportedPost:React.FC<SinglePostReport> = ({post,setOpenUserDialog})=>{
    
    const [activeStatus,setActiveStatus] = useState(post.listed)
    
    const blockUnblockHandler = async()=>{
        const response = await postBlockhandler(post._id,activeStatus)
        if(response) setActiveStatus(!activeStatus)
    }

    return(
        <tr>
          <td className="flex justify-center border-b border-blue-gray-50">
            <img
              src={CLOUDINARY_POST_URL+post.imgVideoURL}
              alt={post.imgVideoURL}
              className=" object-contain w-16 h-16"
            />
          </td>
          <td className="text-center border-b border-blue-gray-50">
            <Typography
                variant="small"
                color="blue-gray"
                className="font-bold"
            >
                {post.postedUser}
            </Typography>
          </td>
          <td className="text-center border-b border-blue-gray-50" onClick={()=>setOpenUserDialog(post.reports)}>
            <Typography
                variant="small"
                color="blue"
                className="cursor-pointer"
            >
                {post.reports.length}
            </Typography>
          </td>
          <td className="text-center border-b border-blue-gray-50">
            <Button size="sm" variant="outlined" onClick={blockUnblockHandler} className={`${activeStatus ? "text-green-500" : "text-red-500"} w-24`}>{activeStatus ? "Active" : "Blocked"}</Button>
          </td>
        </tr>
    )
}

export default SingleReportedPost