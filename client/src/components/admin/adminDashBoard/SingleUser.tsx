import { Avatar, Button, Typography } from "@material-tailwind/react"
import { CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO } from "../../../api/baseURL"
import { useState } from "react"
import { userBlockhandler } from "../../../api/apiConnections/adminConnection"
import { userProfile } from "../../../interfaces/userInterface"
import moment from "moment"

interface SingleUserInterface{
    user:userProfile,
    setUserId:(userId:string)=>void
}

const SingleUser:React.FC<SingleUserInterface> = ({user,setUserId})=>{
    
    const [activeStatus,setActiveStatus] = useState(user.isBlocked)
    
    const blockUnblockHandler = async()=>{
        const response = await userBlockhandler(user._id,activeStatus)
        if(response){
            if(!activeStatus){
                setUserId(user._id)
            }
            setActiveStatus(!activeStatus)
        }
    }

    return(
        <tr>
          <td className="flex justify-center border-b border-blue-gray-50 gap-2">
            <Avatar className="m-2" variant="circular" alt="Profile Pic" src={user.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO} />
          </td>
          <td className="border-b border-blue-gray-50">
            <Typography
                variant="small"
                color="blue-gray"
                className="font-bold"
            >
                {user.userName}
            </Typography>
          </td>
          <td className="text-center border-b border-blue-gray-50">
            <Typography
                variant="small"
                color="blue"
            >
                {user.email}
            </Typography>
          </td>
          <td className="text-center border-b border-blue-gray-50">
            <Typography
                variant="small"
                // color="blue"
            >
                {moment(user.createdAt).format('ll')}
            </Typography>
          </td>
          <td className="text-center border-b border-blue-gray-50">
            <Button size="sm" variant="outlined" onClick={blockUnblockHandler} className={`${activeStatus ? "text-red-500" : "text-green-500"} w-24`}>{activeStatus ? "Blocked" : "Active"}</Button>
          </td>
        </tr>
    )
}

export default SingleUser