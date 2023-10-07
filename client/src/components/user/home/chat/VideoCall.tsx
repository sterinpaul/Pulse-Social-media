import { Button } from "@material-tailwind/react"
import Peer from "peerjs"; // You need to import 'MediaConnection' from PeerJS.
import { useEffect, useRef, useState } from "react"
// import { useParams } from "react-router-dom"
import { io, Socket } from 'socket.io-client'
import { socketURL } from "../../../../api/baseURL";

const VideoCall = ({chatUserName,chatUserId}:{chatUserName:string,chatUserId:string})=>{
    // const {userName} = useParams()
    // const ROOM_ID = chatUserName
    
    const peers:any = {}
    
    console.log('userId in video call',chatUserName,chatUserId)
    const [myPeer,setMyPeer] = useState<Peer | null>(null)
    // const [conn, setConn] = useState<Peer.DataConnection | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const myVideo = useRef<HTMLVideoElement>(null)
    const userVideo = useRef<HTMLVideoElement>(null)
    let socket = useRef<Socket | null>(null)
    // const streamRef = useRef<MediaStream | null>(null); // Store the stream reference
    // const peerRef = useRef<Peer | null>(null)
   
    
    const stopMediaStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }
    
    socket.current = io(socketURL, { transports: ['websocket'] })

    useEffect(()=>{
        const peer = new Peer(chatUserId)
        setMyPeer(peer)

        navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        }).then((stream)=>{
            setStream(stream)
            if(myVideo.current){
                // streamRef.current = stream
                myVideo.current.srcObject = stream
            }
            myPeer?.on('call',(call)=>{
                call.answer(stream)

                call.on('stream',(userVideoStream: MediaStream)=>{
                    if(userVideo.current) {
                        userVideo.current.srcObject = userVideoStream
                    }
                })
                
                call.on('close',()=>{
                    userVideo.current?.remove()
                })

                peers[call.peer] = call
            })
        })
        return ()=>{
            stopMediaStream()
        }
    },[])


    const callUser = ()=>{
        if(chatUserName){
            // Get the user's video stream
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then((stream) => {

                socket.current?.emit('join-room',({stream,chatUserId}))

              // Add your video stream to your own video element
                if(myVideo.current) {
                    myVideo.current.srcObject = stream
                }
              
              // Create a call to the remote user
                const call = myPeer?.call(chatUserName, stream)
              
              // Listen for the remote user's stream and add it to their video element
            //   if (call) {
                call?.on('stream', (userVideoStream) => {
                    if(userVideo.current) {
                        userVideo.current.srcObject = userVideoStream
                    }
                })
            //   }
            }).catch((error) => {
              // Handle getUserMedia error
              console.error('Error accessing camera and microphone:', error)
            })
        }else{
            console.error('userName is undefined')
        }
    }

    const answerCall = ()=>{
        if(chatUserName){
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              }).then((stream) => {
                // Add your video stream to your own video element
                if (myVideo.current) {
                  myVideo.current.srcObject = stream
                }
            
                // Answer the incoming call
                myPeer?.on('call', (call) => {
                  call.answer(stream)
            
                  // Listen for the remote user's stream and add it to their video element
                  call.on('stream', (userVideoStream) => {
                    if(userVideo.current) {
                        userVideo.current.srcObject = userVideoStream
                    }
                  })
                })
            }).catch((error) => {
                // Handle getUserMedia error
                console.error('Error accessing camera and microphone:', error)
            })
        }
    }

    return(
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-center mt-2">Do you want to call {chatUserName} ?</h1>
            <div className="relative">
                
                <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    className="scale-x-[-1] w-full h-60 rounded-lg"
                />
                <video
                    playsInline
                    // muted
                    autoPlay
                    ref={userVideo}
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