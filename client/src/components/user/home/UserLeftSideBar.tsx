import {SetStateAction, useState,useRef} from 'react'
import { useSelector } from "react-redux";
import {
    Button,
    Card,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Dialog,
    DialogBody,
    Input,
    Avatar,
    Typography
  } from "@material-tailwind/react";

  import {
    NewspaperIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    VideoCameraIcon,
    PaperAirplaneIcon,
    EllipsisVerticalIcon
  } from "@heroicons/react/24/outline";


import { getUserbySearch } from '../../../api/apiConnections/userConnection';
import FollowList from './FollowList';
import { useNavigate } from 'react-router-dom';
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from '../../../api/baseURL';


interface userProfile{
  _id:string,
  userName:string,
  firstName:string,
  lastName:string,
  profilePic:string,
  followers:string[]
}

   const UserLeftSideBar = ()=>{
    const {userName,darkMode,profilePic} = useSelector((store:{user:{userName:string,darkMode:boolean,profilePic:string}})=>store.user)
    const [open, setOpen] = useState(false)
    const [searchText,setSearchText] = useState('')
    const [searchedUser,setSearchedUser] = useState<userProfile[]>([])
    const [chatOpen,setChatOpen] = useState(false)
    const [commentText,setCommentText] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [chatUserName,setChatUserName] = useState('')
    const [chatUserPic,setChatUserPic] = useState('')
    

    const navigate = useNavigate()


    const focusMessageInput = (data:{userName:string,profilePic:string})=>{
      if(textAreaRef.current){
        textAreaRef.current.focus()
        setChatUserName(data.userName)
        setChatUserPic(data.profilePic)
      }
    }

    const chatContainerHandler = ()=>{
      setChatOpen(!chatOpen)
      setSearchText('')
      setSearchedUser([])
    }

    const handleOpen = () => {
      setSearchText('')
      setSearchedUser([])
      setOpen(!open)
    }

    const searchUser = async(event: { target: { value: SetStateAction<string>}})=>{
      setSearchText(event.target.value)
      const userData = await getUserbySearch(event.target.value as string)
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

          <ListItem onClick={chatContainerHandler}>
            <ListItemPrefix>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </ListItemPrefix>
            Chat
            <ListItemSuffix>
              <Chip value={2} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
            </ListItemSuffix>
          </ListItem>

          <Dialog open={chatOpen} handler={chatContainerHandler} size='lg' className='overflow-hidden h-[96vh]'>
            <div className='flex'>

              <div className='w-3/5'>
                <div className='p-2 flex flex-col items-center'>
                  <div className='w-20 h-20 rounded-full'>
                    <img className='object-cover w-full h-full rounded-full' src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                  </div>
                  <div className='mt-2'>
                    <input className='bg-gray-300 focus:outline-none p-1 px-4 w-100 rounded text-black' onChange={searchUser} value={searchText} type="text" maxLength={20} placeholder='Search' />
                  </div>
                </div>

                <div>
                  {searchedUser.map((user:{_id:string,userName:string,firstName:string,lastName:string,profilePic:string})=>{
                      if(user.userName === userName){
                        return
                      }else{
                        return (
                          <List key={user._id} className='p-0' onClick={()=>focusMessageInput(user)}>
                            <ListItem className='hover:bg-gray-300 focus:bg-gray-400 rounded-none'>
                              <ListItemPrefix>
                                <Avatar variant="circular" alt="Profile Pic" src={user.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO} />
                              </ListItemPrefix>
                              <div>
                                <Typography variant="h6" color="blue-gray">
                                  {user?.userName}
                                </Typography>
                                <Typography variant="small" color="gray" className="font-normal">
                                  {user?.firstName} {user?.lastName}
                                </Typography>
                              </div>
                            </ListItem>
                          </List>
                        )
                      }
                    }
                  )}
                </div>
              </div>
                
                {/* Message Box */}
              <div className='w-full bg-gray-300 h-[96vh] flex flex-col justify-between'>
                {chatUserName.length ? <div className='pl-4 h-16 bg-blue-gray-200 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div>
                      <Avatar variant="circular" alt="Profile Pic" src={chatUserPic.length ? CLOUDINARY_PROFILE_PHOTO_URL+chatUserPic : PROFILE_PHOTO} />
                    </div>
                    <h1 className='text-black capitalize'>{chatUserName}</h1>
                  </div>
                  <button><EllipsisVerticalIcon className='w-7 h-7 text-black mr-2'/></button>
                </div> : null}


                <div></div>


                <div className='flex justify-around items-center p-2 bg-blue-gray-200'>
                  <div className="w-16 h-12">
                  <Avatar variant="circular" alt="Profile Pic" src={profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+profilePic : PROFILE_PHOTO} />
                  </div>

                  <textarea ref={textAreaRef} onChange={(e)=>setCommentText(e.target.value)} value={commentText} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} h-12 w-full mx-2 text-black p-1 focus:outline-none resize-none rounded-md outline-gray-400 placeholder:text-brown-200`} placeholder="Type something" />

                  <div>
                    <Button variant="text" size="sm" className="rounded-full p-2" ><PaperAirplaneIcon className="w-6 h-6 text-light-blue-800"/></Button>
                  </div>
                </div>
              </div>

            </div>
          </Dialog>

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
