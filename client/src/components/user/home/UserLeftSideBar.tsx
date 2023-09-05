import {SetStateAction, useState} from 'react'
import { useSelector } from "react-redux";
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Dialog,
    DialogBody,
    Input
  } from "@material-tailwind/react";

  import {
    NewspaperIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    VideoCameraIcon
  } from "@heroicons/react/24/outline";


import { getUserbySearch } from '../../../api/apiConnections/userConnection';
import FollowList from './FollowList';
import { useNavigate } from 'react-router-dom';
  
interface userProfile{
  _id:string,
  userName:string,
  firstName:string,
  lastName:string,
  profilePic:string,
  followers:string[]
}

   const UserLeftSideBar = ()=>{
    const {userName,darkMode} = useSelector((store:{user:{userName:string,darkMode:boolean}})=>store.user)
    const [open, setOpen] = useState(false)
    const [searchText,setSearchText] = useState('')
    const [searchedUser,setSearchedUser] = useState<userProfile[]>([])
    const navigate = useNavigate()

    const handleOpen = () => {
      setSearchText('')
      setSearchedUser([])
      setOpen(!open)
    }

    const searchUser = async(event: { target: { value: SetStateAction<string>}})=>{
      setSearchText(event.target.value)
      const userData = await getUserbySearch(searchText)
      if(userData?.length){
        setSearchedUser(userData)
      }else{
        setSearchedUser([])
      }
    }

    const myPosts = ()=>{
      navigate(`/${userName}`)
    }
    
    return (
      <Card className={`${darkMode ? "bg-blue-gray-200" : ""} fixed top-[5.6rem] left-2 h-[calc(100vh-6rem)] overflow-y-scroll max-w-[20rem] p-1 rounded shadow-xl shadow-blue-gray hidden lg:block`}>
        <div className="mb-2 p-4"></div>
        <List>
          <ListItem onClick={myPosts}>
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

          <ListItem onClick={handleOpen}>
            <ListItemPrefix>
              <MagnifyingGlassIcon className="h-5 w-5" />
            </ListItemPrefix>
            Search
          </ListItem>

          <Dialog open={open} handler={handleOpen} size='xs' className='min-h-[10rem] max-h-[25rem]'>
          <div className="p-2">
            <Input onChange={searchUser} value={searchText} icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search" />
          </div>
            <DialogBody>
              {searchedUser?.map((user)=>{
                if(user.userName === userName){
                  return
                }else{
                    return <FollowList user={user} handleOpen={handleOpen} key={user._id}/>
                  }
              })}
            </DialogBody>
          </Dialog>


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
