import { List, Avatar, Dialog, Button } from "@material-tailwind/react"
import SingleChat from "./SingleChat"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { chattedUsers } from "../../../../interfaces/userInterface"
import { CLOUDINARY_CHAT_URL, CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO, SOCKET_URL } from "../../../../api/baseURL"
import { getUserbySearch } from "../../../../api/apiConnections/userConnection"
import { createSingleImgMessage, createSingleMessage, getUserMessages } from "../../../../api/apiConnections/messageConnection"
import { messageInterface } from "../../../../interfaces/messageInterface"
import { getAllChats } from "../../../../api/apiConnections/messageConnection"
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers, setChatList, setReceivedMessages, setRemoteChatId } from "../../../../redux/userRedux/chatSlice"
import { io, Socket } from 'socket.io-client'
import InputEmoji from "react-input-emoji"
import moment from 'moment'
import { toast } from 'react-toastify'
import Peer from 'peerjs'


import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  ArrowLeftIcon,
  PhotoIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom"
import { setFollowNotification, setNotifications, userSignOut } from "../../../../redux/userRedux/userSlice"



interface chatBoxInterface {
  chatOpen: boolean,
  setChatOpen: (value:boolean) => void,
  chatContainerHandler: () => void,
  videoDisplay: boolean,
  setVideoDisplay: (value: boolean) => void
}

const ChatBoxContainer: React.FC<chatBoxInterface> = ({ chatOpen, setChatOpen, chatContainerHandler, videoDisplay, setVideoDisplay }) => {

  const { userName, userId, profilePic, notifications, followNotification } = useSelector((store: { user: { userName: string, userId: string, darkMode: boolean, profilePic: string, notifications: [],followNotification: {user:string,viewed:boolean} } }) => store.user)
  const { onlineUsers, receivedMessages, chatList } = useSelector((store: { chat: { onlineUsers: [], receivedMessages: [], chatList:[] } }) => store.chat)
  const [allChatUsers, setAllChatUsers] = useState<chattedUsers[]>([])
  const [sendMessage, setSendMessage] = useState({})
  const [searchText, setSearchText] = useState('')
  const [chats, setChats] = useState<messageInterface[]>([])
  const [isOnline,setIsOnline] = useState(false)

  const [chatListViewStatus,setChatListViewStatus] = useState(true)

  const [imgChat, setImgChat] = useState<File | null>(null)
  const [imgDialogOpen, setImgDialogOpen] = useState(false)

  const scroll = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const dispatch = useDispatch()
  const [chatUserName, setChatUserName] = useState('')
  const [chatUserId, setChatUserId] = useState('')
  const [chatUserPic, setChatUserPic] = useState('')
  const [commentText, setCommentText] = useState('')
  const navigate = useNavigate()

  const socket = useRef<Socket | null>(null)
  
  const [peerId,setPeerId] = useState('')
  const peer = useRef<Peer | null>(null)
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [firstCaller, setFirstCaller] = useState(false)
  const userVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  const [videoCallReceivedData,setVideoCallReceivedData] = useState({caller:'',peerId:'',userId:'',profilePic:'',chatUserId:''})
  const [videoCallFromOthers,setVideoCallFromOthers] = useState(false)
  const [otherUserBusy,setOtherUserBusy] = useState(false)


  const videoCallFromOthersHandler = ()=>{
    setVideoCallFromOthers(open=>!open)
  }
  

  const dialogOpen = () => {
    if (imgChat) setImgChat(null)
    setImgDialogOpen(!imgDialogOpen)
  }

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
    socket.current = io(SOCKET_URL, { transports: ['websocket'] })

    if (userId.length) {
      socket.current.emit('add-new-user', userId)
      socket.current.on('get-users', (users) => {
        dispatch(setOnlineUsers(users))
      })
    }

    socket.current.on('connect', () => {
      console.log('Connected to Server')
    })

    socket.current.on('user-blocked', () => {
      dispatch(userSignOut())
      toast.error('Blocked by Admin')
      navigate('/')
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

  // Real time notification
  useEffect(()=>{
    if(followNotification?.user){
      socket.current?.emit('follow-user',followNotification)
      dispatch(setFollowNotification({}))
    }
  },[followNotification])

  useEffect(()=>{
    socket.current?.on('user-followed',(data)=>{
      dispatch(setNotifications([data,...notifications]))
    })
  },[notifications])


  // WebRTC Peer initiallisation
  useEffect(()=>{
    peer.current = new Peer()
    peer.current?.on('open', (id: string) => {
      setPeerId(id)
      console.log('My peer ID is: ' + id)
    })
  },[])


  useEffect(() => {
    const receiveMessageHandler = (data: any) => {
      if (data && chatUserId === data.senderId) {
        setChats((chat) => [...chat, data])
      }

      let exists = receivedMessages.some((obj: any) => obj.chatId === data.chatId)

      if (!exists) {
        dispatch(setReceivedMessages(data))
      }
      setTimeout(()=>{
        scroll.current?.scrollIntoView({ behavior: 'smooth' })
      },0)
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
    if(data.userName !== chatUserName){
    
      if (data?.chatId !== undefined) {
        const response = await getUserMessages(data.chatId)
        if (response?.status) {
          setChats(response?.data)
        }
      } else {
        setChats([])
      }

      setChatUserId(data._id)
      dispatch(setRemoteChatId(data._id))
      setChatUserName(data.userName)
      setChatUserPic(data.profilePic)
      setTimeout(()=>{
        scroll.current?.scrollIntoView({ behavior: 'smooth' })
      },0)
    }
    textAreaRef.current?.focus()
    setChatListViewStatus(false)
  }

  const sendAMessage = async () => {
    if (commentText.trim().length && chatUserName.length) {

      const response: { status: boolean, data: messageInterface } = await createSingleMessage(chats[0]?.chatId, userId, chatUserId, commentText)
      if (response?.status) {
        setChats([...chats, response?.data])
        setSendMessage({ _id: response.data._id, senderId: userId, chatId: response.data.chatId, message: commentText, receiverId: chatUserId, imgURL: response.data?.imgURL })
      }
      setCommentText('')

    } else if (imgChat !== null && chatUserName.length) {
      setImgDialogOpen(!imgDialogOpen)
      const response: { status: boolean, data: messageInterface } = await createSingleImgMessage(chats[0]?.chatId, userId, chatUserId, imgChat)
      if (response?.status) {
        setChats([...chats, response?.data])
        setSendMessage({ _id: response.data._id, senderId: userId, chatId: response.data.chatId, message: commentText, receiverId: chatUserId, imgURL: response.data?.imgURL })
      }
      setImgChat(null)
    }
    textAreaRef.current?.focus()
  }

  const searchUserForChat = async (event: { target: { value: SetStateAction<string> } }) => {
    setSearchText(event.target.value)
    if (event.target?.value?.toString().trim().length) {
      const userData = await getUserbySearch(event.target.value as string)
      
      if (userData.length) {
        // Create a Map to store the unique objects by userName
        const uniqueMap = new Map()

        // Add objects from array a to the Map
        userData.forEach((item: { userName: string }) => {
          uniqueMap.set(item.userName, item)
        })

        // Add objects from array b to the Map (overwrite duplicates based on userName)
        chatList.forEach((item: { userName: string }) => {
          uniqueMap.set(item.userName, item)
        })

        setAllChatUsers(Array.from(uniqueMap.values()))
      }
    }else{
      setAllChatUsers(chatList)
    }
  }

  const chooseChatImg = () => {
    if (chatUserName.length) {
      setImgDialogOpen(true)
    }
  }

  // Video chat

  const openVideoChat = async() => {
    setVideoDisplay(true)
    const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if(userVideoRef.current){
      userVideoRef.current.srcObject = streams
    }
    setMyStream(streams)
    setFirstCaller(true)
    socket.current?.emit('initialize-call',{caller:userName,peerId,userId,profilePic,chatUserId})
  }

  const acceptVideoCall = (data:typeof videoCallReceivedData)=>{
    if(!chatOpen){
      setChatOpen(true)
    }
    setVideoDisplay(true)
    setChatUserId(data.userId)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=>{
      setMyStream(stream)
      if(userVideoRef.current){
        userVideoRef.current.srcObject = stream
      }

      const call = peer.current?.call(data.peerId,stream)
      
      call?.on('stream', (streamRemote) => {
        if(remoteVideoRef.current){
          remoteVideoRef.current.srcObject = streamRemote
        }
      })
      
    }).catch((error)=>{
      console.log('Failed to get local stream',error)
    })
  }
  
  useEffect(()=>{
    if(peerId.length){
      socket.current?.on('offer-received',data=>{
        setVideoCallReceivedData(data)
        if(chatOpen){
          if(videoDisplay){
            socket.current?.emit('another-call',data.userId)
          }else{
            videoCallFromOthersHandler()
          }
        }else{
          toast.success(`${data.caller} is calling...`, {
            autoClose: 10000,
            onClick: () => {
              acceptVideoCall(data)
            },
            closeOnClick:true
          })
        }
      })
    }
    
    socket.current?.on('another-caller',()=>{
      toast.error('User is on another call')
    })
    
  },[peerId,chatOpen])
  
  // useEffect(()=>{
  //   socket.current?.on('offer-accepted',(id)=>{
  //     if(myStream){
  //       const call = peer.current?.call(id,myStream)
  //       call?.on('stream', (streamRemote) => {
  //         console.log('second',streamRemote)
  //         if(remoteVideoRef.current){
  //           remoteVideoRef.current.srcObject = streamRemote
  //         }
  //       })
  //     }
  //   })
  // },[myStream])


  useEffect(()=>{
    peer.current?.on('call', (call) => {
      if(myStream){
        call.answer(myStream)
        call.on('stream',stream=>{
          if(remoteVideoRef.current){
            remoteVideoRef.current.srcObject = stream
          }
        })
        // call.on('close',()=>{
        //   if(remoteVideoRef.current){
        //     remoteVideoRef.current?.remove()
        //   }
        // })
      }
    })
  },[myStream])

  const removeVideoTrack = ()=>{
    const tracks = myStream?.getTracks()
    tracks?.forEach((track:any) => {
      track.stop()
    })
    setMyStream(null)
    setVideoDisplay(false)
    if(firstCaller){
      setFirstCaller(false)
    }else{
      setChatOpen(false)
    }
  }
  
  
  const cancelVideoCall = ()=>{
    if(myStream){
      socket.current?.emit('cancel-call',chatUserId)
      removeVideoTrack()
    }
  }


  useEffect(()=>{
    if(myStream){
      socket.current?.on('call-cancelled',()=>{
        removeVideoTrack()
      })
    }
  },[myStream])

  useEffect(()=>{
    socket.current?.on('call-rejected',()=>{
      setOtherUserBusy(true)
      videoCallFromOthersHandler()
    })
  },[])


  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(max-width: 540px)')

  //   const handleMediaQueryChange = (event: { matches: boolean | ((prevState: boolean) => boolean) }) => {
  //     if(event.matches === false){
  //       setChatListViewStatus(true)
  //     }
  //   }

  //   mediaQuery.addEventListener('change',handleMediaQueryChange)

  //   // Cleanup the listener when the component unmounts
  //   return () => {
  //     mediaQuery.removeEventListener('change',handleMediaQueryChange)
  //   }
  // }, [])

  const goBackToChatList = ()=>{
    setChatListViewStatus(true)
  }
  const rejectVideoCall = ()=>{
    videoCallFromOthersHandler()
    socket.current?.emit('reject-call',{caller:videoCallReceivedData?.userId})
  }


  return (
    <Dialog open={chatOpen} handler={chatContainerHandler} size='lg' className='overflow-hidden h-[90svh] flex focus:outline-none'>
      {videoDisplay ? (
        <div className="mx-auto relative group">
          <div className="flex flex-col flex-wrap justify-center sm:flex-row h-[90vh] ">
            <video ref={userVideoRef} className="w-full h-1/2 sm:w-1/2 sm:h-[90vh]" autoPlay playsInline muted />
            <video ref={remoteVideoRef} className="w-full h-1/2 sm:w-1/2 sm:h-[90vh]" autoPlay playsInline />
          </div>
          <div className="absolute bottom-1 left-[43%] sm:left-[45%] xl:left-[47%] hidden group-hover:block">
            <button onClick={cancelVideoCall} className="px-4 py-1 bg-red-700 rounded-xl"><VideoCameraSlashIcon className='w-7 h-7 text-white' /></button>
          </div>
        </div>
      ) : (
        <>
          <div className={`sm:w-full sm:block lg:w-96 lg:block md:w-72 md:block ${chatListViewStatus ? 'w-full' : 'hidden'}`}>
            <div className='p-2 pl-4 flex gap-4 items-center h-16 bg-gray-500'>

              <Avatar variant="circular" alt="Profile Pic" src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL + profilePic) : PROFILE_PHOTO} />
              
              <div>
                <input className='sm:w-[98%] w-[60vw] bg-gray-100 focus:outline-none p-1 rounded text-black' onChange={searchUserForChat} value={searchText} type="text" maxLength={20} placeholder='Search' />
              </div>
              <button><EllipsisVerticalIcon className='h-7 text-black' /></button>
            </div>

            <List className='p-0 overflow-y-scroll h-[calc(100vh-8.5rem)]'>
              {allChatUsers.length ? allChatUsers.map((user: chattedUsers) => {
                return (
                  <SingleChat key={user._id} user={user} focusMessageInput={focusMessageInput} onlineUsers={onlineUsers} setIsOnline={setIsOnline}/>
                )
              })
                : <></>}
            </List>
          </div>

          <div className={`${chatListViewStatus ? 'hidden': null} w-full h-full bg-blue-gray-100 sm:flex flex-col justify-between`}>
            <div className="h-[calc(90vh-4.3rem)] flex flex-col overflow-y-scroll">
              {chatUserName.length ? <div className='pl-4 bg-blue-gray-200 flex items-center justify-between'>
                <div className='flex items-center gap-4'>

                <button onClick={goBackToChatList} className="sm:hidden block rounded-full p-2 bg-blue-gray-300"><ArrowLeftIcon className="w-5 h-5 text-black" /></button>

                  <div className='p-2'>
                    <Avatar variant="circular" alt="Profile Pic" src={chatUserPic?.length ? CLOUDINARY_PROFILE_PHOTO_URL + chatUserPic : PROFILE_PHOTO} />
                  </div>
                  <h1 className='text-black capitalize'>{chatUserName}</h1>
                </div>

                <div>
                  {isOnline ? <button onClick={openVideoChat} className='m-2'><VideoCameraIcon className='w-7 h-7 text-black mr-2' /></button> : null}
                  {/* <button><EllipsisVerticalIcon className='w-7 h-7 text-black mr-2' /></button> */}
                </div>

              </div> : null}
              <div className='overflow-y-scroll flex flex-col'>
                {chats.length ? chats.map((data: { _id: string, senderId: string, message?: string, imgURL?: string, createdAt: string }, index) => {
                  if (data.senderId === userId) {
                    return (
                      <div key={data._id} ref={index === chats.length - 1 ? scroll : null} className='rounded bg-light-blue-100 m-2 w-52 p-1 self-end'>
                        {data.message ? <p className='text-black'>{data.message}</p> : <img src={CLOUDINARY_CHAT_URL + data.imgURL} />}
                        <p className='text-xs text-right break-words'>{moment(data.createdAt).calendar()}</p>
                      </div>
                    )
                  } else {
                    return (
                      <div key={data._id} ref={index === chats.length - 1 ? scroll : null} className='rounded bg-yellow-100 m-2 w-52 p-1 self-start'>
                        {data.message ? <p className='text-black'>{data.message}</p> : <img src={CLOUDINARY_CHAT_URL + data.imgURL} />}
                        <p className='text-xs text-right break-words'>{moment(data.createdAt).calendar()}</p>
                      </div>
                    )
                  }
                }
                )
                  : null}
              </div>
            </div>
            <div className='flex justify-around items-center p-2 bg-blue-gray-200'>
              <div className="w-16 h-12">
                <Avatar variant="circular" alt="Profile Pic" src={profilePic ? CLOUDINARY_PROFILE_PHOTO_URL + profilePic : PROFILE_PHOTO} />
              </div>
              <InputEmoji ref={textAreaRef} onChange={setCommentText} value={commentText} cleanOnEnter onEnter={sendAMessage} placeholder="Type something" />
              <button onClick={chooseChatImg} className="mr-2"><PhotoIcon className="w-6 h-6" /></button>


              <Dialog open={imgDialogOpen} handler={dialogOpen} size="xs" className="outline-none" >
                <div className="m-2 flex flex-col justify-center items-center">
                  
                    <div className="flex flex-col justify-center items-center">
                      <label className="w-20 bg-blue-500 hover:bg-blue-600 text-white text-center py-1 rounded-lg cursor-pointer">Choose
                        <input className="hidden" onChange={(e: any) => setImgChat(e.target?.files?.[0])} name='profilePic' type="file" accept=".jpg,.jpeg,.png" />
                      </label>
                      <p className="file-label">Allowed formats: JPG, JPEG, PNG</p>
                      <img className="max-h-96" src={imgChat ? URL.createObjectURL(imgChat) : ""} />
                      <Button onClick={()=>sendAMessage()} size="sm" className=" m-2 capitalize" disabled={imgChat ? false : true}>Send</Button>
                    </div>
                  
                </div>
              </Dialog>

              <Dialog open={videoCallFromOthers} handler={videoCallFromOthersHandler} size="xs" className="outline-none" >
                <div className="m-2 flex flex-col justify-center items-center gap-2">
                  {otherUserBusy ? (
                  <>
                    <Avatar variant="circular" alt="Profile Pic" src={chatUserPic.length ? (CLOUDINARY_PROFILE_PHOTO_URL+chatUserPic) : PROFILE_PHOTO}/>
                    <p><span className="text-blue-800 text-lg font-bold uppercase">{chatUserName}</span>{` is busy`}</p>
                    <div>
                      <Button size="sm" className="m-2 capitalize" onClick={()=>{
                        videoCallFromOthersHandler()
                        setOtherUserBusy(false)
                      }}>Cancel</Button>
                    </div>
                  </>
                  ) : (
                    <>
                    <Avatar variant="circular" alt="Profile Pic" src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}/>
                    <p><span className="text-blue-800 text-lg font-bold uppercase">{videoCallReceivedData?.caller}</span>{` is calling...`}</p>
                    <div>
                      <Button size="sm" className="m-2 capitalize" onClick={()=>acceptVideoCall(videoCallReceivedData)}>Accept</Button>
                      <Button size="sm" className="m-2 capitalize" onClick={rejectVideoCall}>Reject</Button>
                    </div>
                  </>
                  )}
                  
                </div>
              </Dialog>

            </div>
          </div>
        </>
      )}

    </Dialog>
  )
}

export default ChatBoxContainer