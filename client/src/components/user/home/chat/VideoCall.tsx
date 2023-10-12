import { useState } from 'react'
import AgoraUIKit from "agora-react-uikit";
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const VideoCall = ()=>{
    const [videoCall, setVideoCall] = useState(true);

    const rtcProps = {
        appId: "d0e1c6142f1a47aa89aff774c00c7238",
        channel: "Pulz",
        token: "007eJxTYNi+48ZUz0Ln3wuu1Rj+MVsjeeJU1IF5iaeEtyvc5he58maSAkOKQaphspmhiVGaYaKJeWKihWViWpq5uUmygUGyuZGxRfQ39dSGQEYGG0VPZkYGCATxWRgCSnOqGBgA6DwgdA==",
    }

    const callbacks = {
        EndCall: () => setVideoCall(false),
    }
    const navigate = useNavigate()

    return videoCall ? (
        // <div style={{ display: "flex", width: "100vw", height: "100vh" }} >
        <div className='flex w-screen h-screen justify-center'>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : (
        <div className='flex items-center justify-center w-screen h-screen gap-2'>
            <Button size="sm" onClick={() => setVideoCall(true)}>Join</Button>
            <Button size="sm" onClick={() => navigate('/')}>Home</Button>
        </div>
      )
}

export default VideoCall