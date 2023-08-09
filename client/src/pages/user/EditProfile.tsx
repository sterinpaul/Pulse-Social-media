import UserNavBar from "../../components/user/home/UserNavBar"
import UserLeftSideBar from "../../components/user/home/UserLeftSideBar"
import EditProfileForm from "../../components/user/profile/EditProfileForm"

const EditProfile = ()=>{
    return(
        <>
            <UserNavBar/>
            <UserLeftSideBar/>
            <EditProfileForm/>
        </>
    )
}

export default EditProfile