import { useSelector } from "react-redux";
import {
  Card,
  Typography,
  ListItem,
  List
} from "@material-tailwind/react";
import { userProfile } from "../../../interfaces/userInterface";
import { CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO } from "../../../api/baseURL";


interface RightSideBarProps{
  chatOpen:boolean,
  setChatOpen:(value:boolean)=>void
}

const UserRightSideBar:React.FC<RightSideBarProps> = ({setChatOpen})=>{

  const {darkMode} = useSelector((store:{user:{userName:string,userId:string,darkMode:boolean}})=>store.user)
  const {chatList} = useSelector((store:{chat:{onlineUsers:[],chatList:[]}})=>store.chat)

    return (
      <Card className={`${darkMode ? "bg-blue-gray-200" : ""} fixed top-[5.6rem] h-[60vh] right-2 overflow-y-scroll max-w-[20rem] p-1 pb-1.5 rounded shadow-xl shadow-blue-gray hidden lg:block`}>
        <div className="text-center p-2">
          <Typography variant="h5" color="blue-gray">
            Recent Chat
          </Typography>
        </div>
        <List className="flex justify-center p-4">

        {chatList?.length ? chatList.map((user:userProfile)=>{
            return(
                <ListItem onClick={()=>setChatOpen(true)} key={user.chatId} className={`flex items-center justify-center p-2 w-52"`}>
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO}
                      alt="nature image"
                    />
                    <p className="ml-4 w-28">{user.firstName} {user.lastName}</p>
                </ListItem>
            )
        }) : <p>No Chats yet.</p>}
        </List>

      </Card>
    );
  }

export default UserRightSideBar
