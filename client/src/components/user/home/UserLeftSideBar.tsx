
import { SetStateAction, useState,useRef,useEffect } from 'react'
import { useSelector,useDispatch } from "react-redux";
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
  EllipsisVerticalIcon,
  VideoCameraSlashIcon
} from "@heroicons/react/24/outline";

import moment from 'moment'

// import Peer from 'simple-peer'

import { getUserbySearch } from '../../../api/apiConnections/userConnection';
import FollowList from './FollowList';
import { useNavigate } from 'react-router-dom';
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL, socketURL } from '../../../api/baseURL';
import {io,Socket} from 'socket.io-client'
import { clearNotifications } from '../../../redux/userRedux/userSlice';
import { createNewChat, getAllChats } from '../../../api/apiConnections/chatConnections';
import { createSingleMessage, getUserMessages } from '../../../api/apiConnections/messageConnection';
import { messageInterface } from '../../../interfaces/messageInterface';


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
  const {userName,userId,darkMode,profilePic} = useSelector((store:{user:{userName:string,userId:string,darkMode:boolean,profilePic:string}})=>store.user)
  const [searchText,setSearchText] = useState('')
  const [searchedUser,setSearchedUser] = useState<userProfile[]>([])
  // const [open, setOpen] = useState(false)
  // const [chatOpen,setChatOpen] = useState(false)
  const [commentText,setCommentText] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const socket = useRef<Socket | null>(null)
  const [chatUserName,setChatUserName] = useState('')
  const [chatUserId,setChatUserId] = useState('')
  const [chatUserPic,setChatUserPic] = useState('')

  const [allChatUsers,setAllChatUsers] = useState<userProfile[]>([])
  const [sendMessage,setSendMessage] = useState({})
  const [onlineUsers,setOnlineUsers] = useState([])
  const [receivedMessage,setReceivedMessage] = useState({})
  const [chats,setChats] = useState<messageInterface[]>([])
  const [newMessage,setNewMessage] = useState('')
  const dispatch = useDispatch()
  const scroll = useRef<HTMLDivElement>(null)
  const [messageContainer,setMessageContainer] = useState(true)

  const [me,setMe] = useState('')
  const [name,setName] = useState('')
  const [caller,setCaller] = useState('')
  const [startVideoCall,setStartVideoCall] = useState(false)
  const [callerSignal,setCallerSignal] = useState()
  const [callAccepted,setCallAccepted] = useState(false)
  const [stream,setStream] = useState()
  const [idToCall,setIdToCall] = useState('')
  const [callEnded,setCallEnded] = useState(true)
  const [receivingCall,setReceivingCall] = useState(false)
  // const myVideo = useRef({ srcObject: null })
  const myVideo = useRef<HTMLVideoElement | null>(null)
  const userVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<any>()


  useEffect(()=>{
      socket.current = io(socketURL,{ transports: ['websocket'] })
      if(userId.length){
        socket.current.emit('add-new-user',userId)
        socket.current.on('get-users',(users)=>{
          setOnlineUsers(users)
        })
      }

      socket.current.on('connect',()=>{
        console.log('Connected to Server')
      })

      // Handling the error
      socket.current.on('connect_error',(error)=>{
        console.log('Connection error:',error)
      })

      return()=>{
        if(socket?.current){
          socket.current.disconnect()
        }
      }
    },[userId])
    

    useEffect(()=>{
      const receiveMessageHandler = (data:any)=>{
        if(data && chatUserId===data.senderId){
          setChats([...chats,data])
        }
        setReceivedMessage(data)
      }
      socket?.current?.on('receive-message',receiveMessageHandler)
      return ()=>{
        socket?.current?.off('receive-message',receiveMessageHandler)
      }
    },[chatUserId])


    useEffect(()=>{
      if(sendMessage !== null){
        socket.current?.emit('send-message',sendMessage)
        scroll.current?.scrollIntoView({ behavior: 'smooth'})
      }
    },[sendMessage])

    const navigate = useNavigate()

    const getChatList = async()=>{
      try{
        const response = await getAllChats(userId)
        if(response?.status){
          setAllChatUsers(response.data)
        }
      }catch(error){
        console.log(error)
      }
    }

    useEffect(()=>{
      getChatList()
      initialliseVideoCall()
    },[userId])

    // useEffect(()=>{
    //   if(startVideoCall){
    //     initialliseVideoCall()
    //   }
    // },[startVideoCall])

    // const checkOnline = (chat:any)=>{
    //   const chatMember = chat.members.find((member:string)=>member !== userId)
    //   const online = onlineUsers.find((user:{userId:string})=>user.userId !== chatMember)
    //   return online ? true : false
    // }

    const focusMessageInput = async(data:{_id:string,userName:string,profilePic:string,chatId?:string})=>{
      
      scroll.current?.scrollIntoView({ behavior: 'smooth'})
      if(textAreaRef.current){
        if(data?.chatId !== undefined){
          const response = await getUserMessages(data.chatId)          
          if(response?.status){
            setChats(response?.data)
          }
        }else{
          setChats([])
        }
        
        textAreaRef.current.focus()
        setChatUserId(data._id)
        setChatUserName(data.userName)
        setChatUserPic(data.profilePic)
        setMessageContainer(!messageContainer)
      }
    }

    const sendAMessage = async()=>{
      if(commentText.trim().length){
        if(chats?.length){
          const response:{status:boolean,data:messageInterface} = await createSingleMessage(chats[0]?.chatId,userId,commentText)
          if(response?.status){
            setChats([...chats,response?.data])
            setSendMessage({_id:response?.data?._id,senderId:userId,chatId:chats[0]?.chatId,message:commentText,receiverId:chatUserId})
          }
        }else{
          const response:{status:boolean,data:{_id:string}} = await createNewChat(userId,chatUserId)
          if(response?.status){
            const messageResponse:{status:boolean,data:any} = await createSingleMessage(response.data?._id,userId,commentText)
            setChats([messageResponse?.data])
            setSendMessage({_id:messageResponse?.data?._id,senderId:userId,chatId:response.data?._id,message:commentText,receiverId:chatUserId})
          }
        }
        setCommentText('')
      }
      textAreaRef.current?.focus()
    }

    // Auto-Scroll to latest message
    // useEffect(() => {
    //   scroll.current?.scrollIntoView({ behavior: 'smooth' })
    // }, [sendMessage]);


    const chatContainerHandler = ()=>{
      setChatOpen(!chatOpen)
      setSearchText('')
      setSearchedUser([])
      if(chatOpen){
        dispatch(clearNotifications())
      }
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

    const searchUserForChat = async(event: { target: { value: SetStateAction<string>}})=>{
      setSearchText(event.target.value)
      if(event.target.value.toString().trim().length){
        const userData = await getUserbySearch(event.target.value as string)
        const previousChatUsers = allChatUsers
        
        if(userData.length){
          // Create a Map to store the unique objects by userName
          const uniqueMap = new Map<string, typeof userData[0]>();
  
          // Add objects from array a to the Map
          userData.forEach((item:{userName:string}) => {
            uniqueMap.set(item.userName, item)
          })
  
          // Add objects from array b to the Map (overwrite duplicates based on userName)
          allChatUsers.forEach((item:{userName:string}) => {
            uniqueMap.set(item.userName, item)
          })
          
          // const uniqueObjects = Array.from(uniqueMap.values())
  
          // setSearchedUser(Array.from(uniqueMap.values()))
          setAllChatUsers(Array.from(uniqueMap.values()))
        }else{
          setAllChatUsers(previousChatUsers)
        }
      }
    }

    // Video chat
    const initialliseVideoCall = ()=>{
      navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream:any)=>{
        setStream(stream)
        if(myVideo.current){
          myVideo.current.srcObject = stream
        }
      })

      socket.current?.on('me',(id)=>{
        setMe(id)
      })

      socket.current?.on('call-user',(data:any)=>{
        setReceivingCall(true)
        setCaller(data.from)
        setName(data.name)
        setCallerSignal(data.signal)
      })
    }

    // const startCall = (id:string)=>{
    const startCall = ()=>{
      setStartVideoCall(true)
      setCallEnded(false)
      const peer = new Peer({
        initiator:true,
        trickle:false,
        stream:stream
      }) 
      peer.on('signal',(data:any)=>{
        socket.current?.emit('call-user',{
          userToCall:chatUserId,
          signalData:data,
          from:me,
          name:name
        })
      })

      peer.on('stream',(stream:any)=>{
        if (userVideo.current){
          userVideo.current.srcObject = stream;
        }
      })

      socket.current?.on('call-accepted',(signal)=>{
        setCallAccepted(true)
        peer.signal(signal)
      })
      connectionRef.current = peer
    }

    const answerCall = ()=>{
      setCallAccepted(true)
      const peer = new Peer({
        initiator:false,
        trickle:false,
        stream:stream
      })

      peer.on('signal',(data:any)=>{
        socket.current?.emit('answer-call',{signal:data,to:caller})
      })

      peer.on('stream',(stream:any)=>{
        if (userVideo.current){
          userVideo.current.srcObject = stream;
        }
      })
      if(callerSignal){
        peer.signal(callerSignal)
      }
      connectionRef.current = peer
    }

    const endCall = ()=>{
      setCallEnded(true)
      setStartVideoCall(false)
      connectionRef.current?.destroy()
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

          <Dialog open={chatOpen} handler={chatContainerHandler} size='lg' className='overflow-hidden h-[96vh] flex'>
            {/* <div className='flex'> */}

              <div className='w3/5'>
                <div className='p-1 flex gap-1 items-center justify-evenly h-16 bg-gray-500'>
                  <div className='w-12 h-12 rounded-full'>
                    <img className='object-cover w-full h-full rounded-full' src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                  </div>
                  <div>
                    <input className='bg-gray-100 focus:outline-none p-1 px-4 w-100 rounded text-black' onChange={searchUserForChat} value={searchText} type="text" maxLength={20} placeholder='Search' />
                  </div>
                </div>

                <div className='overflow-y-scroll'>
                  {


                  // searchedUser?.length ? searchedUser.map((user:{_id:string,userName:string,chatId?:string,firstName:string,lastName:string,profilePic:string})=>{
                  //       return (
                  //         <List key={user._id} className='p-0' onClick={()=>focusMessageInput(user)}>
                  //           <ListItem className='rounded-none hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-400 '>
                  //             <ListItemPrefix>
                  //               <Avatar variant="circular" alt="Profile Pic" src={user.profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+user.profilePic : PROFILE_PHOTO} />
                  //             </ListItemPrefix>
                  //             <div>
                  //               <Typography variant="h6" color="blue-gray">
                  //                 {user?.userName}
                  //               </Typography>
                  //               <Typography variant="small" color="gray" className="font-normal">
                  //                 {user?.firstName} {user?.lastName}
                  //               </Typography>
                  //             </div>
                  //             <ListItemSuffix>
                  //               time
                  //             </ListItemSuffix>
                  //           </ListItem>
                  //         </List>
                  //       )
                      
                  //   }) : 



                    allChatUsers.length ? allChatUsers?.map((user:{_id:string,userName:string,chatId?:string,firstName:string,lastName:string,profilePic:string})=>{
                    return (
                      <List key={user._id} className='p-0' onClick={()=>focusMessageInput(user)}>
                        <ListItem className='rounded-none hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-400 '>
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
                          <ListItemSuffix>
                            time
                          </ListItemSuffix>
                        </ListItem>
                      </List>
                    )
                  })
                   : null }
                </div>
              </div>
                
              <div className='w-full bg-blue-gray-100 h-[96vh] flex flex-col justify-between'>
                {chatUserName.length ? <div className='pl-4 bg-blue-gray-200 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='p-2'>
                      <Avatar variant="circular" alt="Profile Pic" src={chatUserPic?.length ? CLOUDINARY_PROFILE_PHOTO_URL+chatUserPic : PROFILE_PHOTO} />
                    </div>
                    <h1 className='text-black capitalize'>{chatUserName}</h1>
                  </div>
                  <div>
                    {callEnded ? <button onClick={startCall} className='m-2'><VideoCameraIcon className='w-7 h-7 text-black mr-2'/></button> : 
                    <button onClick={endCall} className='m-2'><VideoCameraSlashIcon className='w-7 h-7 text-black mr-2'/></button>}
                    <button><EllipsisVerticalIcon className='w-7 h-7 text-black mr-2'/></button>
                  </div>
                </div> : null}


                {startVideoCall ?  (
                <div className='flex flex-col justify-center items-center gap-2'>
                  {stream ? (<video
                    className="rounded-full"
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    style={{ width: "250px" }}
                  />) : null}
                  {callAccepted && !callEnded ? (
                    <video 
                    className="rounded-full"
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "300px" }} />
                  ) : null}
                  {receivingCall && !callAccepted ? (
                    <div className='p-4 w-full h-full'>
                      <h1>{name} is calling...</h1>
                      <Button onClick={answerCall}>Answer</Button>
                    </div>
                  ) : null}
                  <Button onClick={endCall}>Cancel</Button>
                </div>
                ) : (<div className='overflow-y-scroll flex flex-col'>
                  {chats.length ? chats.map((data:{_id:string,senderId:string,message:string,createdAt:string},index)=>{
                    if(data.senderId===userId){
                      return (
                        <div key={data._id} ref={index===chats.length-1 ? scroll : null} className='rounded bg-white m-2 w-52 p-1 self-end'>
                          <p className='text-black'>{data.message}</p>
                          <p className='text-xs text-right'>{moment(data.createdAt).calendar()}</p>
                        </div>
                        )
                      }else{
                        return (
                          <div key={data._id} ref={index===chats.length-1 ? scroll : null} className='rounded bg-white m-2 w-52 p-1 self-start'>
                            <p className='text-black'>{data.message}</p>
                            <p className='text-xs text-right'>{moment(data.createdAt).calendar()}</p>
                          </div>
                        )
                      }
                    }
                  )
                  : null}
                </div>)
                }


                <div className='flex justify-around items-center p-2 bg-blue-gray-200'>
                  <div className="w-16 h-12">
                  <Avatar variant="circular" alt="Profile Pic" src={profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+profilePic : PROFILE_PHOTO} />
                  </div>

                  <textarea ref={textAreaRef} onChange={(e)=>setCommentText(e.target.value)} value={commentText} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} h-12 w-full mx-2 text-black p-1 focus:outline-none resize-none rounded-md outline-gray-400 placeholder:text-brown-200`} placeholder="Type something" />

                  <div>
                    <Button onClick={sendAMessage} variant="text" size="sm" className="rounded-full p-2" ><PaperAirplaneIcon className="w-6 h-6 text-light-blue-800"/></Button>
                  </div>
                </div>
              </div>

            {/* </div> */}
          </Dialog>

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
              {searchedUser?.map((user)=>{
                  return <FollowList user={user} handleOpen={handleOpen} key={user._id}/>
                }
              )}
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
