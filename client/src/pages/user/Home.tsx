import UserNavBar from "../../components/user/home/UserNavBar"
import UserBody from "../../components/user/home/UserBody"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import UserRightSideBar from "../../components/user/home/UserRightSideBar"
import { useEffect } from "react"

const Home = ()=>{

    useEffect(()=>{
        
    },[])
    // const homePageData = getUserHome

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