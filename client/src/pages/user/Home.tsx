import UserNavBar from "../../components/user/home/UserNavBar"
import UserBody from "../../components/user/home/UserBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import UserRightSideBar from "../../components/user/home/UserRightSideBar"
import { getUserHome } from "../../api/apiConnections/userConnection"
import { useState,useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/userRedux/userSlice"

const Home = ()=>{
    // const {userName} = useSelector((store:{user:{userName:string,_id:string,darkMode:boolean,profilePic:string}})=>store.user.userName)
    const dispatch = useDispatch()
    const [userData,setUserData] = useState({})


    useEffect(()=>{
        homePageData()
    },[])

    const homePageData = async()=>{
        const response:any= await getUserHome()
        const reduxData = {
            userName: response?.userName,
            darkMode: response?.darkMode,
            profilePic:response?.profilePic,
        }
        dispatch(setUser(reduxData))
        setUserData(response)
    }

    return(
        <>
            <UserNavBar/>
            <UserLeftSideBar/>
            <UserRightSideBar/>
            <UserBody/>
        </>
    )
}
export default Home