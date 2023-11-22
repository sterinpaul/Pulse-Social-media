import { useState,useRef } from "react";
import { useSelector } from "react-redux";
import UserBodyPost from "./UserBodyPost";
import { Button } from "@material-tailwind/react";
import {PhotoIcon,PencilSquareIcon,NoSymbolIcon} from "@heroicons/react/24/outline";
import { CLOUDINARY_PROFILE_PHOTO_URL,PROFILE_PHOTO } from "../../../api/baseURL";
import { publishNewPost } from "../../../api/apiConnections/postConnection";
import { postData } from "../../../interfaces/postInterface";
import { userInterface } from "../../../interfaces/userInterface";
import LoadingSpinner from "../loading/LoadingSpinner";
import { getAllPosts } from "../../../api/apiConnections/userConnection";
import InfiniteScroll from 'react-infinite-scroll-component';

interface UserBodyProps {
    userData: userInterface,
    allPosts:postData[],
    setAllPosts:React.Dispatch<React.SetStateAction<postData[]>>
}

const UserBody:React.FC<UserBodyProps> = ({userData,allPosts,setAllPosts})=>{
    const {...reduxData} = useSelector((store:{user:{userName:string,userId:string,darkMode:boolean,profilePic:string}})=>store.user)
    const [textData,setTextData] = useState("")
    const [upload,setUpload] = useState<File | null>()
    const fileInput = useRef<HTMLInputElement | null>(null)
    const [loading,setLoading] = useState(false)
    const [skip,setSkip] = useState<number>(1)

    const uploadFunction = ()=>{
        fileInput.current?.click()
    }

    const publishPost = async()=>{
        if(textData.trim().length && upload){
            setLoading(true)
            setTextData("")
            setUpload(null)
            const response:any = await publishNewPost(textData,upload)
            response.profilePic = reduxData.profilePic
            setAllPosts([response,...allPosts])
            setLoading(false)
        }
    }

    const deletePost = (postId:string)=>{
        const postsAfterDelete = allPosts.filter((post) => post._id !== postId)
        setAllPosts(postsAfterDelete)
    }


    // useEffect(() => {
    //     const handleScroll = async () => {    
    //       if ((window.innerHeight + window.scrollY) === (document.body.offsetHeight)) {
    //         setSkip(prev=>prev+1)
    //         const response = await getAllPosts(skip)
    //             if(Array.isArray(response)){
    //                 setAllPosts((prevData)=>[...prevData,...response])
    //             }
    //         }
    //     }
    //     window.addEventListener('scroll', handleScroll)
    //     return () => {
    //       window.removeEventListener('scroll', handleScroll)
    //     }
    // }, [skip])

    const getAllpostPagination = async()=>{
        setSkip((prev)=>prev+1)
        const response = await getAllPosts(skip)
        if(Array.isArray(response)){
            setAllPosts((prevData)=>[...prevData,...response])
        }
    }
      
      

    return (
        <div className={`${reduxData?.darkMode ? "bg-blue-gray-100" : "bg-gray-200"} pb-1.5 min-h-screen flex flex-col items-center`}>
            <div className={`${reduxData?.darkMode ? "bg-blue-gray-200" : "bg-white"} h-41 shadow-xl w-[calc(100vw-1rem)] p-3 shadow-blue-gray mt-[5.6rem] rounded overflow-y-hidden lg:w-[calc(100vw-33rem)] relative`}>
                <div className="flex gap-2 overflow-scroll p-1">
                    
                    <div className="w-10 h-10">
                        <img className="w-full h-full rounded-full outline outline-1 outline-gray-600 object-cover" src={reduxData?.profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+reduxData.profilePic) : PROFILE_PHOTO}/>
                    </div>
                    
                    <div className="flex flex-col w-full gap-3">
                        
                        <textarea onChange={(e)=>setTextData(e.target.value)} value={textData} className={`${reduxData?.darkMode ? "bg-blue-gray-100" : "bg-gray-200"} w-full resize-none h-24 border p-2 rounded-md outline outline-1 outline-gray-400 placeholder:text-brown-200`} placeholder="Enter your text" />
                        
                        <div className="flex gap-2 justify-end overflow-visible p-1">
                            <div>
                                <input ref={fileInput} accept=".jpg,.jpeg,.gif,.png,.svg,.webp,.ogg,.wmv,.mpeg,.mp4" name='postImgVideo' onChange={(event:any)=>setUpload(event?.target?.files[0])} className="w-0 h-0" type="file"/>
                                <Button onClick={uploadFunction} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800 hover:shadow-none">
                                  {upload ? <span className="flex gap-1"><span className="font-thin text-[.5rem]">{upload.name}</span><PencilSquareIcon className="h-4 w-4"/></span> : <PhotoIcon className="h-4 w-4"/>}
                                </Button>
                            </div>
                            <Button disabled={upload ? false : true} onClick={()=>setUpload(null)} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800 hover:shadow-none"><NoSymbolIcon className="h-4 w-4"/></Button>
                            <Button disabled={upload && textData.trim().length ? false : true} size="sm" onClick={publishPost} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800 hover:shadow-none">Publish</Button>
                        </div>
                    </div>
                </div>
                    {loading ? <LoadingSpinner/> : null}
            </div>

            <InfiniteScroll
                dataLength={allPosts.length}
                next={getAllpostPagination}
                hasMore={true}
                loader={null}
            >

                {allPosts.map((post:postData)=>{
                    return <UserBodyPost post={post} userData={userData!} deletePost={deletePost} key={post?._id}/>
                    })
                }
            </InfiniteScroll>

        </div>
    )
}

export default UserBody;