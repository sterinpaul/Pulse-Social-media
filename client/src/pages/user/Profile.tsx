import ProfileBody from "../../components/user/profile/ProfileBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import {UserNavBar} from "../../components/user/home/UserNavBar"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { getProfile, getSavedPosts } from "../../api/apiConnections/userConnection"
import { setFollow, userSignOut } from "../../redux/userRedux/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { postData } from "../../interfaces/postInterface"
import { userInterface } from "../../interfaces/userInterface"

// interface profile{
//     _id?:string,
//     userName: string,
//     firstName?: string,
//     lastName?: string,
//     email?: string,
//     mobile?: string,
//     isBlocked?: boolean,
//     darkMode?: boolean,
//     profilePic: string,
//     gender?: string,
//     city?: string,
//     bio?:string,
//     followRequested?: [],
//     followRequests?: [],
//     followers?: string[],
//     following?: string[],
//     savedPosts?: string[],
//     createdAt?: string,
//     updatedAt?: string,
//     posts?: postData[]
// }



const Profile = ()=>{
    const {user} = useParams()
    const [profileData,setProfileData] = useState<userInterface>()
    const {userName} = useSelector((store: { user: { userName: string } })=>store.user)
    const [saved,setSaved] = useState<postData[] | []>([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [chatOpen,setChatOpen] = useState(false)
    const [searchOpen,setSearchOpen] = useState(false)

    useEffect(()=>{
        getUserDetails()
    },[user])

    const getUserDetails = async()=>{
        const response:any = await getProfile(user as string)
        const savedPosts:any = await getSavedPosts()

        if(response?.message === 'Token expired' || savedPosts?.message === 'Token expired'){
            dispatch(userSignOut())
            navigate('/')
            toast.error(response.message)
        }else{
            setSaved(savedPosts)
            const followerStatus = response.followers.includes(userName)
            dispatch(setFollow(followerStatus))
            setProfileData(response)
        }
    }
    
    return(
        <>
            <UserNavBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <UserLeftSideBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <ProfileBody profileData={profileData || {} as userInterface} saved={saved} />
        </>
    )
}

export default Profile
