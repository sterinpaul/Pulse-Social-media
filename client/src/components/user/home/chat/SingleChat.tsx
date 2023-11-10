// import { SetStateAction, useState,useRef,useEffect } from 'react'
// import { useSelector,useDispatch } from "react-redux";
// import moment from 'moment'
import {
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Avatar,
  Typography
} from "@material-tailwind/react";


import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from '../../../../api/baseURL';

import { chattedUsers, onlineUsersInterface } from '../../../../interfaces/userInterface';

interface chatInterface{
  user:chattedUsers,
  focusMessageInput:(user:{_id:string,userName:string,profilePic:string,chatId?:string})=>void
  onlineUsers:onlineUsersInterface[],
  setIsOnline:(value:boolean)=>void
}

const SingleChat:React.FC<chatInterface> = ({user,focusMessageInput,onlineUsers,setIsOnline})=>{
  
  const onlineStatus = onlineUsers.some((person:{userId:string})=>person.userId===user._id)
  // const [status,setStatus] = useState(onlineStatus)
  // console.log('online',onlineUsers,status,user._id)

  return(
    
    <ListItem onClick={(event)=>{
      focusMessageInput(user)
      setIsOnline(onlineStatus)
      const listItem = event.currentTarget;
    
    // Remove the 'active' class from all siblings
    const siblings = listItem.parentElement?.children;
    if (siblings) {
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] !== listItem) {
          siblings[i].classList.remove("bg-gray-300")
        }
      }
    }
    
    // Add the 'active' class to the clicked item
    listItem.classList.add("bg-gray-300")

      }} className='rounded-none hover:bg-gray-400 focus:bg-gray-400'>
      <ListItemPrefix>
        <Avatar variant="circular" alt="Profile Pic" src={user.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO} />
      </ListItemPrefix>
      <div>
        <Typography variant="h6" color="blue-gray">
          {user?.userName}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {user?.firstName} {user?.lastName}
        </Typography>
      </div>
      <ListItemSuffix>
        {onlineStatus ? <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div> : <></>}
      </ListItemSuffix>
    </ListItem>
    
  )
}

export default SingleChat