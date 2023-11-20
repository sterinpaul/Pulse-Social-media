import {UserNavBar} from "../../components/user/home/UserNavBar"
import UserBody from "../../components/user/home/UserBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import UserRightSideBar from "../../components/user/home/UserRightSideBar"
import { getUserHome } from "../../api/apiConnections/userConnection"
import { useState,useEffect } from "react"
import { userInterface } from "../../interfaces/userInterface"
import { getAllPosts } from "../../api/apiConnections/userConnection"
import { postData } from "../../interfaces/postInterface"
import { useDispatch } from "react-redux"
import { userSignOut } from "../../redux/userRedux/userSlice"
import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"

const Home = ()=>{
    const [userData,setUserData] = useState<userInterface | null>(null)
    const [allPosts,setAllPosts] = useState<postData[]>([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [chatOpen,setChatOpen] = useState(false)
    const [searchOpen,setSearchOpen] = useState(false)
    
    useEffect(()=>{
        homePageData()
    },[])

    const homePageData = async()=>{
        const getHomeResponse:userInterface= await getUserHome()
        const postResponse = await getAllPosts()
        
        if(getHomeResponse){
            setUserData(getHomeResponse)
        }
        if(Array.isArray(postResponse)){
            setAllPosts(postResponse)
        }else if(postResponse?.message === 'Token expired'){
            dispatch(userSignOut())
            navigate('/')
            // toast.error(postResponse.message)
        }
    }

    return(
        <>
            <UserNavBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <UserLeftSideBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <UserRightSideBar chatOpen={chatOpen} setChatOpen={setChatOpen}/>
            <UserBody userData={userData || {} as userInterface} allPosts={allPosts} setAllPosts={setAllPosts} />
        </>
    )
}
export default Home