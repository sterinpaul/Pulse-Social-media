import { useRef,useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Peer from "peerjs";
import { Button } from "@material-tailwind/react";
// import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { io,Socket } from 'socket.io-client'
import { SOCKET_URL } from "../../../../api/baseURL";
// import {v4 as uuid} from 'uuid'



// const VideoCall = ({chatUserName,chatUserId,setVideoDisplay,socket}:{chatUserName:string,chatUserId:string,setVideoDisplay:(value:boolean)=>void,socket:any})=>{
const VideoCall = ()=>{
    const { userId } = useSelector((store: { user: { userName: string, userId: string} }) => store.user)
    const { userChatId } = useSelector((store: { chat: { userChatId: string} }) => store.chat)
    const {roomId} = useParams()
    const [streamData,setStreamData] = useState<MediaStream | null>(null)
    // const [roomId,setRoomId] = useState('')
    const socket = useRef<Socket | null>(null)
    

    const myVideoRef = useRef<HTMLVideoElement | null>(null)
    const userVideoRef = useRef<HTMLVideoElement | null>(null)

    const peer = new Peer()
    const peers: { [key: string]: any } = {}
    
    
    useEffect(()=>{
        socket.current = io(SOCKET_URL, { transports: ['websocket'] })
        peer.on('open',()=>{
            console.log('inside peer.on open')
            socket.current?.emit('join-room',roomId,userId)
        })
            navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            }).then(stream=>{
                console.log('stream',stream)
                setStreamData(stream)
                if(myVideoRef.current){
                    myVideoRef.current.srcObject = stream
                    myVideoRef.current.addEventListener('loadedmetadata', () => {
                        myVideoRef.current?.play()
                    })
                }
    
                // peer.on('open',id=>{
                //     console.log('inside peer.on open')
                //     socket.current.emit('join-room',userId+chatUserId,id)
                // })

                var call = peer.call(userChatId,stream)
                call.on('stream', remoteStream=>{
                    if(userVideoRef.current){
                        userVideoRef.current.srcObject = remoteStream
                        userVideoRef.current.addEventListener('loadedmetadata', () => {
                            userVideoRef.current?.play()
                        })
                    }
                })
                
    
                peer.on('call',call=>{
                    call.answer(stream)
                    console.log('calling....')
                    
                    call.on('stream',userVideoStream=>{
                        if(userVideoRef.current){
                            userVideoRef.current.srcObject = userVideoStream
                            userVideoRef.current.addEventListener('loadedmetadata', () => {
                                userVideoRef.current?.play()
                            })
                        }
                    })
    
                    call.on('close',()=>{
                        userVideoRef.current?.remove()
                    })
                })
    
                socket.current?.on('user-connected',(userId:string)=>{
                    console.log('userId',userId)
                    
                    const call = peer.call(userId,stream)
                    call.on('stream',userVideoStream=>{
                        if(userVideoRef.current){
                            userVideoRef.current.srcObject = userVideoStream
                        }
                    })
                
                    call.on('close',()=>{
                        userVideoRef.current?.remove()
                    })
                    peers[userId] = call
                })
    
                socket.current?.on('user-disconnected',(userId:string)=>{
                    if(peers[userId]){
                        peers[userId].close()
                    }
                })
            }).catch(error=>{
                console.log('Error accessing camera and microphone:',error)
            })
    },[])
        
    const callUser = ()=>{
        var call = peer.call(userChatId,streamData!)
        call.on('stream', remoteStream=>{
            if(userVideoRef.current){
                userVideoRef.current.srcObject = remoteStream
                userVideoRef.current.addEventListener('loadedmetadata', () => {
                    userVideoRef.current?.play()
                })
            }
        })
    }

    const answerCall = ()=>{
        peer.on('call',call=>{
            call.answer(streamData!)
            console.log('calling....')
            
            call.on('stream',userVideoStream=>{
                if(userVideoRef.current){
                    userVideoRef.current.srcObject = userVideoStream
                    userVideoRef.current.addEventListener('loadedmetadata', () => {
                        userVideoRef.current?.play()
                    })
                }
            })

            call.on('close',()=>{
                userVideoRef.current?.remove()
            })
        })
    }


    return(
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
            {/* <Button onClick={()=>setVideoDisplay(false)} className="rounded-full"><ArrowSmallLeftIcon className="w-5 h-5"/></Button> */}
            <h1 className="text-center">Do you want to call {userChatId} ?</h1>
            
            <div className="relative">
                
                <video
                    playsInline
                    muted
                    ref={myVideoRef}
                    autoPlay
                    className="scale-x-[-1] w-full h-100 rounded-lg"
                />
                <video
                    playsInline
                    // muted
                    autoPlay
                    ref={userVideoRef}
                    className="scale-x-[-1] object-cover w-1/3 h-1/3 rounded-lg right-0 bottom-0 absolute"
                />
            </div>
            <div className="text-center flex justify-center gap-4">
                <Button className="w-24 capitalize" onClick={callUser} size="sm">Call</Button>
                <Button className="w-24 capitalize" onClick={answerCall} size="sm">Answer</Button>
            </div>
        </div>
    )
}

export default VideoCall