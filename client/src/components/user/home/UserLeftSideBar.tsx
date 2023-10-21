
import { SetStateAction,useState} from 'react'
import { useSelector,useDispatch } from "react-redux";
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
  // PhotoIcon,
  // VideoCameraIcon
} from "@heroicons/react/24/outline";


import { getUserbySearch } from '../../../api/apiConnections/userConnection';
import FollowList from './FollowList';
import { useNavigate } from 'react-router-dom';
import { clearNotifications } from '../../../redux/userRedux/userSlice';
import ChatBoxContainer from './chat/ChatBoxContainer';
import { clearReceivedMessages } from '../../../redux/userRedux/chatSlice';

interface userProfile{
  _id:string,
  userName:string,
  chatId?:string,
  firstName:string,
  lastName:string,
  profilePic:string,
  followers:string[]
}

interface UserLeftBarInterface{
  searchOpen:boolean,
  setSearchOpen:(value:boolean)=>void,
  chatOpen:boolean,
  setChatOpen:(value:boolean)=>void
}


const UserLeftSideBar:React.FC<UserLeftBarInterface> = ({searchOpen,setSearchOpen,chatOpen,setChatOpen})=>{
  const {userName,darkMode} = useSelector((store:{user:{userName:string,userId:string,darkMode:boolean,profilePic:string}})=>store.user)
  const receivedMessages = useSelector((store:{chat:{receivedMessages:[]}})=>store.chat.receivedMessages)
  // const uniqueMessages = receivedMessages.map((data:any)=>data)

  const uniqueArray = receivedMessages.reduce((accumulator:any, currentObject:any) => {
    // Check if the current object's "id" property already exists in the accumulator
    const exists = accumulator.some((obj:any) => obj.id === currentObject.id)
  
    // If it doesn't exist, add it to the accumulator
    if (!exists) {
      accumulator.push(currentObject)
    }
    return accumulator
  }, [])
  
  

  const [searchText,setSearchText] = useState('')
  const [searchedUser,setSearchedUser] = useState<userProfile[]>([])
  const [videoDisplay, setVideoDisplay] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const socket = useRef<Socket | null>(null)

  
  const chatContainerHandler = ()=>{
    if(videoDisplay){
      setVideoDisplay(false)
    }
    setChatOpen(!chatOpen)
    setSearchText('')
    setSearchedUser([])
    if(chatOpen){
      dispatch(clearNotifications())
    }
    dispatch(clearReceivedMessages())
  }

  const handleOpen = () => {
    setSearchText('')
    setSearchedUser([])
    setSearchOpen(!searchOpen)
  }

  const searchUser = async(event: { target: { value: SetStateAction<string>}})=>{
    setSearchText(event.target.value)
    
    const userData = await getUserbySearch(event.target.value as string)
    
    if(userData.length){
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
        <ListItem onClick={chatContainerHandler}>
          <ListItemPrefix>
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          </ListItemPrefix>
          Chat
            <ListItemSuffix>
            {uniqueArray?.length ? (
              <Chip value={uniqueArray?.length} size="sm" variant="ghost" color="blue-gray" className="rounded-full h-6" />
              ) : <div className='h-6'></div>
            }
            </ListItemSuffix>
        </ListItem>
        <ChatBoxContainer chatOpen={chatOpen} chatContainerHandler={chatContainerHandler} videoDisplay={videoDisplay} setVideoDisplay={setVideoDisplay} />
        
        <ListItem onClick={handleOpen}>
          <ListItemPrefix>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </ListItemPrefix>
          Search
        </ListItem>
        <Dialog open={searchOpen} handler={handleOpen} size='xs' className='min-h-[10rem] max-h-[25rem]'>
        <div className="p-2">
          <Input onChange={searchUser} value={searchText} icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search" />
        </div>
          <DialogBody>
            <List className='h-72 overflow-y-scroll'>
            {searchedUser?.map((user)=>{
                return <FollowList user={user} handleOpen={handleOpen} key={user._id}/>
              }
            )}
            </List>
          </DialogBody>
        </Dialog>
      </List>
      
    </Card>
  )
}




export default UserLeftSideBar

