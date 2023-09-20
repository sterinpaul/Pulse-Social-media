import {UserNavBar} from "../../components/user/home/UserNavBar"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import EditProfileForm from "../../components/user/profile/EditProfileForm"
import { useState } from "react"

const EditProfile = ()=>{
    const [chatOpen,setChatOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    return(
        <>
            <UserNavBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <UserLeftSideBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <EditProfileForm/>
        </>
    )
}

export default EditProfile