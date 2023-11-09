
import Peer from 'peerjs'
import { useEffect, useRef, useState } from 'react'

const VideoCall = ()=>{
    const peer = useRef<Peer | null>(null)
    const userVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const [myStream,setMyStream] = useState<MediaStream | null>(null)
    const [localPeerId,setLocalPeerId] = useState('')
    const [remotePeerId,setRemotePeerId] = useState('')


    useEffect(()=>{
        peer.current = new Peer()
        peer.current.on('open',id=>{
            setLocalPeerId(id)
        })

        navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then((stream)=>{
            setMyStream(stream)
            if(userVideoRef.current){
                userVideoRef.current.srcObject = stream
            }
        })

    },[])

    const connectUser = ()=>{
        const call = peer.current?.call(remotePeerId,myStream!)
        call?.on('stream',stream=>{
            if(remoteVideoRef.current){
                remoteVideoRef.current.srcObject = stream
            }
        })
    }

    useEffect(()=>{
        peer.current?.on('call',call=>{
            call.answer(myStream!)
            call.on('stream',stream=>{
                if(remoteVideoRef.current){
                    remoteVideoRef.current.srcObject = stream
                }
            })
        })
    },[])


    return(
        <div>
            <input value={localPeerId} type="text" readOnly/> 
            <input onChange={(e)=>setRemotePeerId(e.target.value)} type="text"/>

            <div className='text-center'>
                <button onClick={connectUser} className='bg-orange-900 rounded px-1 m-1'>Connect</button>
            </div>
            <div className="flex flex-col flex-wrap justify-center items-center sm:flex-row h-[90vh]">
                <video ref={userVideoRef} className="w-full h-1/2 sm:w-1/2 sm:h-[90vh]" autoPlay playsInline muted />
                <video ref={remoteVideoRef} className="w-full h-1/2 sm:w-1/2 sm:h-[90vh]" autoPlay playsInline />
            </div>
        </div>
    )
}
export default VideoCall