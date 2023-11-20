import { useState } from 'react';
import { CLOUDINARY_PROFILE_PHOTO_URL,PROFILE_PHOTO } from '../../../api/baseURL';
import {
    Button,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Avatar,
    Typography
  } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { followHandler } from '../../../api/apiConnections/userConnection';
import { useNavigate } from 'react-router-dom';
import { setFollowNotification } from '../../../redux/userRedux/userSlice';

const FollowList = ({user,handleOpen}:{user:{_id:string,userName:string,firstName:string,lastName:string,profilePic:string,followers:string[]},handleOpen:(value:boolean) => void})=>{
    const {userName,profilePic} = useSelector((store:{user:{userName:string,profilePic:string,darkMode:boolean}})=>store.user)
    const followerStatus = user && user.followers && user.followers.includes(userName)
    const [follow,setFollow] = useState(followerStatus)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const goToProfile = ()=>{
        handleOpen(false)
        navigate(`/${user.userName}`)
    }

    const followUnfollowHandler = async()=>{
      const response:{followerId?:string,profilePic?:string} = await followHandler(user?.userName)
      if(response){
        if(follow){
          user?.followers?.splice(user.followers.indexOf(userName),1)
        }else{
          user?.followers?.push(userName)
          response.followerId = user?._id
          response.profilePic = profilePic
          dispatch(setFollowNotification(response))
        }
        setFollow(!follow)
      }
    }

    return (
        <ListItem>
          <ListItemPrefix onClick={goToProfile}>
            <Avatar variant="circular" alt="Profile Pic" src={user?.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO} />
          </ListItemPrefix>
          <div onClick={goToProfile}>
            <Typography variant="h6" color="blue-gray">
              {user?.userName}
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              {user?.firstName} {user?.lastName}
            </Typography>
          </div>
          <ListItemSuffix>
            <Button size='sm' className='w-20 capitalize' onClick={followUnfollowHandler}>{follow ? "Unfollow" : "Follow" }</Button>
          </ListItemSuffix>
        </ListItem>
    )
}

export default FollowList