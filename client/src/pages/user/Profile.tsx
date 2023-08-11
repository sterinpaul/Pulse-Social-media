import ProfileBody from "../../components/user/profile/ProfileBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import UserNavBar from "../../components/user/home/UserNavBar"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getProfile } from "../../api/apiConnections/userConnection"


interface profile{
    _id?: string,
    userName?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    mobile?:string,
    isBlocked?: boolean,
    darkMode?: boolean,
    profilePic?: string,
    gender?: string,
    city?: string,
    bio?:string,
    savedPosts?:object[]
    blockedByUsers?: object[],
    blockedUsers?: object[],
    followRequested?: object[],
    followRequests?: object[],
    followers?: object[],
    following?: object[],
    createdAt?: string,
}

const Profile = ()=>{
    const {user} = useParams()    
    const [profileData,setProfileData] = useState<profile | undefined>()
    
    useEffect(()=>{
        if(user){
            getUserDetails()
        }
    },[])

    const getUserDetails = async()=>{
    const response:profile = await getProfile(user!)
        setProfileData(response)
    }
    
    return(
        <>
            <UserNavBar/>
            <UserLeftSideBar/>
            {profileData ? <ProfileBody {...profileData}/> : <div></div>}
        </>
    )
}

export default Profile