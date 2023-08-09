import { useSelector } from "react-redux";
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
  } from "@material-tailwind/react";
  import {
    NewspaperIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    VideoCameraIcon
  } from "@heroicons/react/24/outline";
 

   const UserLeftSideBar = ()=>{
    const {darkMode} = useSelector((store:{user:{reduxUser:{userName:string,userId:string,darkMode:boolean}}})=>store.user.reduxUser)
    return (
      <Card className={`${darkMode ? "bg-blue-gray-200" : ""} fixed top-[5.6rem] left-2 h-[calc(100vh-6rem)] overflow-y-scroll max-w-[20rem] p-1 rounded shadow-xl shadow-blue-gray hidden lg:block`}>
        <div className="mb-2 p-4"></div>
        <List>
        <ListItem>
            <ListItemPrefix>
              <NewspaperIcon className="h-5 w-5" />
            </ListItemPrefix>
            My Posts
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </ListItemPrefix>
            Chat
            <ListItemSuffix>
              <Chip value={2} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <MagnifyingGlassIcon className="h-5 w-5" />
            </ListItemPrefix>
            Search
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <PhotoIcon className="h-5 w-5" />
            </ListItemPrefix>
            Images
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <VideoCameraIcon className="h-5 w-5" />
            </ListItemPrefix>
            Videos
          </ListItem>
        </List>
        
      </Card>
    );
  }




export default UserLeftSideBar
