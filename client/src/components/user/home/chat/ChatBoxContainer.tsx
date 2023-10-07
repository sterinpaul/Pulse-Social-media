import { List, Avatar, Dialog } from "@material-tailwind/react"
import SingleChat from "./SingleChat"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { chattedUsers } from "../../../../interfaces/userInterface"
import { CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO, socketURL } from "../../../../api/baseURL"
import { getUserbySearch } from "../../../../api/apiConnections/userConnection"
import { createSingleMessage, getUserMessages } from "../../../../api/apiConnections/messageConnection"
import { createNewChat } from "../../../../api/apiConnections/chatConnection"
import { messageInterface } from "../../../../interfaces/messageInterface"
import { getAllChats } from "../../../../api/apiConnections/messageConnection"
// import { getAllChats } from "../../../../api/apiConnections/chatConnection"
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers, setChatList, setReceivedMessages } from "../../../../redux/userRedux/chatSlice"
import { io, Socket } from 'socket.io-client'
import InputEmoji from "react-input-emoji"
import moment from 'moment'
// import { useNavigate } from "react-router-dom"
import VideoCall from "./VideoCall"


import {
  VideoCameraIcon,
  // PaperAirplaneIcon,
  EllipsisVerticalIcon,
  // VideoCameraSlashIcon
} from "@heroicons/react/24/outline";


interface chatBoxInterface {
  chatOpen: boolean,
  chatContainerHandler: () => void
}

const ChatBoxContainer: React.FC<chatBoxInterface> = ({ chatOpen, chatContainerHandler }) => {

  const { userId, profilePic } = useSelector((store: { user: { userName: string, userId: string, darkMode: boolean, profilePic: string } }) => store.user)
  const { onlineUsers, receivedMessages } = useSelector((store: { chat: { onlineUsers: [], receivedMessages: [] } }) => store.chat)
  const [allChatUsers, setAllChatUsers] = useState<chattedUsers[]>([])
  const [sendMessage, setSendMessage] = useState({})
  const [searchText, setSearchText] = useState('')
  const [chats, setChats] = useState<messageInterface[]>([])
  const scroll = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const dispatch = useDispatch()
  const [chatUserName, setChatUserName] = useState('')
  const [chatUserId, setChatUserId] = useState('')
  const [chatUserPic, setChatUserPic] = useState('')
  const [commentText, setCommentText] = useState('')
  // const navigate = useNavigate()
  const socket = useRef<Socket | null>(null)
  const [videoDisplay, setVideoDisplay] = useState(false)


  const getChatList = async () => {
    try {
      const response = await getAllChats(userId)
      if (response?.status) {
        setAllChatUsers(response.data)
        dispatch(setChatList(response.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getChatList()
  }, [sendMessage, receivedMessages, onlineUsers])

  useEffect(() => {
    socket.current = io(socketURL, { transports: ['websocket'] })
    if (userId.length) {
      socket.current.emit('add-new-user', userId)
      socket.current.on('get-users', (users) => {
        dispatch(setOnlineUsers(users))
      }
      )
    }

    socket.current.on('connect', () => {
      console.log('Connected to Server')
    })

    // Handling the error
    socket.current.on('connect_error', (error) => {
      console.log('Connection error:', error)
    })

    return () => {
      if (socket?.current) {
        socket.current.disconnect()
      }
    }
  }, [userId])


  useEffect(() => {
    const receiveMessageHandler = (data: any) => {
      if (data && chatUserId === data.senderId) {
        setChats((chat) => [...chat, data])
      }
      let exists = receivedMessages.some((obj: any) => obj.chatId === data.chatId)

      if (!exists) {
        dispatch(setReceivedMessages(data))
      }

      scroll.current?.scrollIntoView({ behavior: 'smooth' })
    }

    socket.current?.on('receive-message', receiveMessageHandler)
    return () => {
      socket.current?.off('receive-message', receiveMessageHandler)
    }
  }, [chatUserId])


  useEffect(() => {
    if (sendMessage !== null) {
      socket.current?.emit('send-message', sendMessage)
      scroll.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [sendMessage])

  const focusMessageInput = async (data: { _id: string, userName: string, profilePic: string, chatId?: string }) => {
    setSearchText('')
    scroll.current?.scrollIntoView({ behavior: 'smooth' })
    if (textAreaRef.current) {
      if (data?.chatId !== undefined) {
        const response = await getUserMessages(data.chatId)
        if (response?.status) {
          setChats(response?.data)
        }
      } else {
        setChats([])
      }

      textAreaRef?.current?.focus()
      setChatUserId(data._id)
      setChatUserName(data.userName)
      setChatUserPic(data.profilePic)
    }
  }

  const sendAMessage = async () => {

    if (commentText.trim().length) {
      if (chats?.length) {
        const response: { status: boolean, data: messageInterface } = await createSingleMessage(chats[0]?.chatId, userId, commentText)
        if (response?.status) {
          setChats([...chats, response?.data])
          setSendMessage({ _id: response?.data?._id, senderId: userId, chatId: chats[0]?.chatId, message: commentText, receiverId: chatUserId })
        }
      } else {
        const response: { status: boolean, data: { _id: string } } = await createNewChat(userId, chatUserId)
        if (response?.status) {
          const messageResponse: { status: boolean, data: any } = await createSingleMessage(response.data?._id, userId, commentText)
          setChats([messageResponse?.data])
          setSendMessage({ _id: messageResponse?.data?._id, senderId: userId, chatId: response.data?._id, message: commentText, receiverId: chatUserId })
        }
      }
      setCommentText('')
    }
    textAreaRef.current?.focus()
  }

  const searchUserForChat = async (event: { target: { value: SetStateAction<string> } }) => {
    setSearchText(event.target.value)
    if (event?.target?.value?.toString().trim().length) {
      const userData = await getUserbySearch(event.target.value as string)
      const previousChatUsers = allChatUsers

      if (userData.length) {
        // Create a Map to store the unique objects by userName
        const uniqueMap = new Map<string, typeof userData[0]>();

        // Add objects from array a to the Map
        userData.forEach((item: { userName: string }) => {
          uniqueMap.set(item.userName, item)
        })

        // Add objects from array b to the Map (overwrite duplicates based on userName)
        allChatUsers.forEach((item: { userName: string }) => {
          uniqueMap.set(item.userName, item)
        })

        // const uniqueObjects = Array.from(uniqueMap.values())

        // setSearchedUser(Array.from(uniqueMap.values()))
        setAllChatUsers(Array.from(uniqueMap.values()))
      } else {
        setAllChatUsers(previousChatUsers)
        setAllChatUsers([])
      }
    }
  }


  // Video chat
  const openVideoChat = () => {
    setVideoDisplay(true)
  }

  // const initializeVideoCall = ()=>{
  //   setStartVideoCall(true)
  //   navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream:any)=>{
  //     setStream(stream)

  //     if(myVideo?.current){
  //       myVideo.current.srcObject = stream
  //     }else{
  //       console.error("myVideo.current is null")
  //     }

  //   })
  //   .catch((error:any) => {
  //     console.error('Error accessing media devices:', error);
  //   })

  //   socket.current?.on('me',(id:any)=>{
  //     setMe(id)
  //   })

  //   socket.current?.on('call-user',(data:any)=>{
  //     setReceivingCall(true)
  //     setCaller(data.from)
  //     setName(data.name)
  //     setCallerSignal(data.signal)
  //   })

  //   setCallEnded(false)
  // }


  //   const endCall = ()=>{
  //     setCallEnded(true)
  //     setStartVideoCall(false)
  //     setCallAccepted(false)
  //     setReceivingCall(false)
  //     setStream(undefined)
  //     setCaller('')
  //     setName('')
  //     setCallerSignal(null)
  //     connectionRef.current?.destroy()
  //     if(stream){
  //       const tracks = stream.getTracks()
  //       tracks.forEach((track:any) => {
  //         track.stop();
  //       })
  //     }
  //   }


  return (
    <Dialog open={chatOpen} handler={chatContainerHandler} size='lg' className='overflow-hidden h-[96vh] flex'>
      {videoDisplay ? (
        <>
        <VideoCall chatUserName={chatUserName} />
        </>
      ) : (
        <>
          <div className='w3/5'>
              <div className='p-1 flex gap-1 items-center justify-evenly h-16 bg-gray-500'>
                <div className='w-12 h-12 rounded-full'>
                  <img className='object-cover w-full h-full rounded-full' src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                </div>
                <div>
                  <input className='bg-gray-100 focus:outline-none p-1 px-4 w-100 rounded text-black' onChange={searchUserForChat} value={searchText} type="text" maxLength={20} placeholder='Search' />
                </div>
              </div>
              
              <List className='p-0 overflow-y-scroll'>
                  {allChatUsers.length ? allChatUsers.map((user:chattedUsers)=>{
                    return (
                      <SingleChat key={user._id} user={user} focusMessageInput={focusMessageInput} onlineUsers={onlineUsers} />
                      )
                    })
                   : <></>}
              </List>
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
              <button onClick={openVideoChat} className='m-2'><VideoCameraIcon className='w-7 h-7 text-black mr-2'/></button>  
              <button><EllipsisVerticalIcon className='w-7 h-7 text-black mr-2'/></button>
            </div>

          </div> : null}
          <div className='overflow-y-scroll flex flex-col'>
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
          </div>
                
          <div className='flex justify-around items-center p-2 bg-blue-gray-200'>
            <div className="w-16 h-12">
            <Avatar variant="circular" alt="Profile Pic" src={profilePic ? CLOUDINARY_PROFILE_PHOTO_URL+profilePic : PROFILE_PHOTO} />
            </div>
            <InputEmoji ref={textAreaRef} onChange={setCommentText} value={commentText} cleanOnEnter onEnter={sendAMessage} placeholder="Type something" />
            
          </div>
      </div>
      </>)
      }

    </Dialog>
  )
}

export default ChatBoxContainer