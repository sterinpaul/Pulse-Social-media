import ProfileBody from "../../components/user/profile/ProfileBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import UserNavBar from "../../components/user/home/UserNavBar"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { getProfile } from "../../api/apiConnections/userConnection"
import { userSignOut } from "../../redux/userRedux/userSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { postData } from "../../interfaces/postInterface"

interface profile{
    userName: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    mobile: string,
    isBlock?: boolean,
    darkMode?: boolean,
    profilePic: string,
    gender?: string,
    city?: string,
    bio?:string,
    blockedByUsers?: [],
    blockedUsers?: [],
    followRequested?: [],
    followRequests?: [],
    followers?: string[],
    following?: string[],
    savedPosts?: object[],
    createdAt?: string,
    updatedAt?: string,
    posts: postData[]
}

const Profile = ()=>{
    const {user} = useParams()    
    const [profileData,setProfileData] = useState<profile>()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        getUserDetails()
    },[user])

    const getUserDetails = async()=>{
    const response:any = await getProfile(user!)
    
        if(response){
            setProfileData(response)
        }else if(response?.message === 'Token expired'){
            dispatch(userSignOut())
            navigate('/')
            toast.error(response.message)
        }
    }
    
    return(
        <>
            <UserNavBar/>
            <UserLeftSideBar/>
            {profileData ? <ProfileBody profileData={profileData}/> : <></>}
        </>
    )
}

export default Profile