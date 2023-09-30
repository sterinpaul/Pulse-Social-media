import { List,Button,Avatar,Dialog } from "@material-tailwind/react"
import SingleChat from "./SingleChat"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { chattedUsers } from "../../../../interfaces/userInterface"
import { CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO, socketURL } from "../../../../api/baseURL"
import { getUserbySearch } from "../../../../api/apiConnections/userConnection"
import { createSingleMessage, getUserMessages } from "../../../../api/apiConnections/messageConnection"
import { createNewChat } from "../../../../api/apiConnections/chatConnection"
import { messageInterface } from "../../../../interfaces/messageInterface"
import { getAllChats } from "../../../../api/apiConnections/messageConnection"
import { useSelector,useDispatch } from "react-redux";
import { setOnlineUsers,setChatList } from "../../../../redux/userRedux/chatSlice"
import {io,Socket} from 'socket.io-client'
// import InputEmoji from "react-input-emoji"
import moment from 'moment'

// import Peer from 'peerjs'
// import Peer from 'simple-peer'
// import Peer from 'simple-peer/simplepeer.min.js'

import {
  VideoCameraIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  VideoCameraSlashIcon
} from "@heroicons/react/24/outline";


// interface receivedMessageInterface{
//   _id: string,
//   chatId: string,
//   message: string,
//   receiverId: string,
//   senderId: string
// }

interface chatBoxInterface{
  chatOpen:boolean,
  chatContainerHandler:()=>void
}

const ChatBoxContainer:React.FC<chatBoxInterface> = ({chatOpen,chatContainerHandler}) => {

  const {userId,darkMode,profilePic} = useSelector((store:{user:{userName:string,userId:string,darkMode:boolean,profilePic:string}})=>store.user)
  const onlineUsers = useSelector((store:{chat:{onlineUsers:[]}})=>store.chat.onlineUsers)
  const [allChatUsers,setAllChatUsers] = useState<chattedUsers[]>([])
  const [sendMessage,setSendMessage] = useState({})
  const [searchText,setSearchText] = useState('')
  const [chats,setChats] = useState<messageInterface[]>([])
  const scroll = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const dispatch = useDispatch()
  const [chatUserName,setChatUserName] = useState('')
  const [chatUserId,setChatUserId] = useState('')
  const [chatUserPic,setChatUserPic] = useState('')
  const [commentText,setCommentText] = useState('')
  const [me,setMe] = useState('')
  const [name,setName] = useState('')
  const [caller,setCaller] = useState('')
  const [startVideoCall,setStartVideoCall] = useState(false)
  const [callerSignal,setCallerSignal] = useState(null)
  const [callAccepted,setCallAccepted] = useState(false)
  const [stream,setStream] = useState<MediaStream>()
  // const [idToCall,setIdToCall] = useState('')
  const [callEnded,setCallEnded] = useState(true)
  const [receivingCall,setReceivingCall] = useState(false)
  // const [receivedMessage,setReceivedMessage] = useState<receivedMessageInterface | null>(null)
  // const [newMessage,setNewMessage] = useState('')
  
  // const peer = new Peer()
  // const myVideo = useRef({ srcObject: null })
  console.log(me,caller,callerSignal)
  
  const myVideo = useRef<HTMLVideoElement | null>(null)
  const userVideo = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef<any>(null)
  const socket = useRef<Socket | null>(null)
  
  const getChatList = async()=>{
    try{
      const response = await getAllChats(userId)
      if(response?.status){
        setAllChatUsers(response.data)
        dispatch(setChatList(response.data))
      }
    }catch(error){
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getChatList()
  },[userId,onlineUsers])

  useEffect(()=>{
    socket.current = io(socketURL,{ transports: ['websocket'] })
    if(userId.length){
        socket.current.emit('add-new-user',userId)
        socket.current.on('get-users',(users)=>{
          dispatch(setOnlineUsers(users))
        }
      )
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
        setChats((chat)=>[...chat,data])
      }
      scroll.current?.scrollIntoView({ behavior: 'smooth'})
    }
    socket.current?.on('receive-message',receiveMessageHandler)
    return ()=>{
      socket.current?.off('receive-message',receiveMessageHandler)
    }
  },[chatUserId])

  useEffect(()=>{
    if(sendMessage !== null){
      socket.current?.emit('send-message',sendMessage)
      scroll.current?.scrollIntoView({ behavior: 'smooth'})
    }
  },[sendMessage])
  
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
      
      textAreaRef?.current?.focus()
      setChatUserId(data._id)
      setChatUserName(data.userName)
      setChatUserPic(data.profilePic)
      // setMessageContainer(!messageContainer)
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
  
  const searchUserForChat = async(event: { target: { value: SetStateAction<string>}})=>{
      setSearchText(event.target.value)
      if(event?.target?.value?.toString().trim().length){
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
  const initializeVideoCall = ()=>{
    console.log("Initializing video call...")
    setStartVideoCall(true)
    navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream:any)=>{
      console.log("getUserMedia succeeded:", stream)
      setStream(stream)
      
      if(myVideo?.current){
        myVideo.current.srcObject = stream
      }else{
        console.error("myVideo.current is null")
      }

    })
    .catch((error:any) => {
      console.error('Error accessing media devices:', error);
    })
    
    socket.current?.on('me',(id:any)=>{
      setMe(id)
    })
    
    socket.current?.on('call-user',(data:any)=>{
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
    
    setCallEnded(false)
  }
  
 



    const endCall = ()=>{
      setCallEnded(true)
      setStartVideoCall(false)
      setCallAccepted(false)
      setReceivingCall(false)
      setStream(undefined)
      setCaller('')
      setName('')
      setCallerSignal(null)
      connectionRef.current?.destroy()
      if(stream){
        const tracks = stream.getTracks()
        tracks.forEach((track:any) => {
          track.stop();
        })
      }
    }
    

  return (
    <Dialog open={chatOpen} handler={chatContainerHandler} size='lg' className='overflow-hidden h-[96vh] flex'>
          <div className='w3/5'>
              <div className='p-1 flex gap-1 items-center justify-evenly h-16 bg-gray-500'>
                <div className='w-12 h-12 rounded-full'>
                  <img className='object-cover w-full h-full rounded-full' src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                </div>
                <div>
                  <input className='bg-gray-100 focus:outline-none p-1 px-4 w-100 rounded text-black' onChange={searchUserForChat} value={searchText} type="text" maxLength={20} placeholder='Search' />
                </div>
              </div>
              {/* <div className='overflow-y-scroll'> */}
              <List className='p-0 overflow-y-scroll'>
                  {allChatUsers.length ? allChatUsers.map((user:chattedUsers)=>{
                    return (
                      <SingleChat key={user._id} user={user} focusMessageInput={focusMessageInput} onlineUsers={onlineUsers} />
                      )
                    })
                   : <></>}
              </List>
          </div>
      {/* <div> */}
      <div className='w-full bg-blue-gray-100 h-[96vh] flex flex-col justify-between'>
          {chatUserName.length ? <div className='pl-4 bg-blue-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='p-2'>
                <Avatar variant="circular" alt="Profile Pic" src={chatUserPic?.length ? CLOUDINARY_PROFILE_PHOTO_URL+chatUserPic : PROFILE_PHOTO} />
              </div>
              <h1 className='text-black capitalize'>{chatUserName}</h1>
            </div>
            <div>
              {callEnded ? <button onClick={initializeVideoCall} className='m-2'><VideoCameraIcon className='w-7 h-7 text-black mr-2'/></button> : 
              <button onClick={endCall} className='m-2'><VideoCameraSlashIcon className='w-7 h-7 text-black mr-2'/></button>}
              <button><EllipsisVerticalIcon className='w-7 h-7 text-black mr-2'/></button>
            </div>
          </div> : null}
          {startVideoCall ? (
                <div className='flex flex-col justify-center items-center gap-2'>
                  {stream && <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    style={{ width: "250px" }}
                  />}
                  {callAccepted && !callEnded ? (
                    <video
                    className="rounded-full"
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "200px" }} />
                  ) : null} 
                  {receivingCall && !callAccepted ? (
                    <div className='p-4 w-full h-full'>
                      <h1>{name} is calling...</h1>
                      {/* <Button onClick={answerCall}>Answer</Button> */}
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
          {startVideoCall ? null : <div className='flex justify-around items-center p-2 bg-blue-gray-200'>
            <div className="w-16 h-12">
            <Avatar variant="circular" alt="Profile Pic" src={profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+profilePic : PROFILE_PHOTO} />
            </div>
            <textarea ref={textAreaRef} onChange={(e)=>setCommentText(e.target.value)} value={commentText} className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} h-12 w-full mx-2 text-black p-1 focus:outline-none resize-none rounded-md outline-gray-400 placeholder:text-brown-200`} placeholder="Type something" />
            {/* <InputEmoji ref={textAreaRef} onChange={(e:any)=>setCommentText(e.target.value)} value={commentText} cleanOnEnter onEnter={sendAMessage} placeholder="Type something" /> */}
            <div>
              <Button onClick={sendAMessage} variant="text" size="sm" className="rounded-full p-2" ><PaperAirplaneIcon className="w-6 h-6 text-light-blue-800"/></Button>
            </div>
          </div>}
      </div>
    
  </Dialog>
  )
}

export default ChatBoxContainer