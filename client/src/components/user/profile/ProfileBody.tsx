import { useSelector,useDispatch } from "react-redux";
import { changePhoto } from "../../../redux/userRedux/userSlice";
import { updateProfilePhoto } from "../../../api/apiConnections/userConnection";
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from "../../../api/baseURL";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { followHandler } from "../../../api/apiConnections/userConnection";
import { postData } from "../../../interfaces/postInterface";
import { getSavedPosts } from "../../../api/apiConnections/userConnection";
import { userSignOut } from "../../../redux/userRedux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SinglePostPhoto from "./SinglePostPhoto";
import FollowersList from "./FollowersList";

import {
    Tabs,
    TabsHeader,
    TabsBody,
    TabPanel,
    Tab,
    Button,
    Dialog,
    DialogBody
  } from "@material-tailwind/react";
import {
    PhotoIcon,
    FilmIcon,
    BookmarkIcon,
  } from "@heroicons/react/24/solid";

  interface UserProfile {
    userName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isBlock?: boolean;
    darkMode?: boolean;
    profilePic?: string;
    gender?: string;
    city?: string;
    bio?: string;
    blockedByUsers?: [];
    blockedUsers?: [];
    followRequested?: [];
    followRequests?: [];
    followers?: string[];
    following?: string[];
    savedPosts?: object[];
    createdAt?: string;
    updatedAt?: string;
    posts: postData[];
}

const ProfileBody = ({profileData}:{profileData:UserProfile})=>{
    const [open, setOpen] = useState(false)
    const [followOpen,setFollowOpen] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const {userName,profilePic,darkMode} = useSelector((store:{user:{userName:string,profilePic:string,darkMode:boolean}})=>store.user)
    const dispatch = useDispatch()
    const [profilePhoto,setProfilePhoto] = useState<File | null>(null)
    const [submitState,setSubmitState] = useState(true)
    const [profileImg,setProfileImg] = useState(profilePic)
    const followersStatus = profileData?.followers?.includes(userName)
    const [follow,setFollow] = useState(followersStatus)
    const [saved,setSaved] = useState<postData[]>([])
    const navigate = useNavigate()
    const [folowFollowing,setFolowFollowing] = useState('')
    

    useEffect(()=>{
        getSaved()
    },[])

    const getSaved = async()=>{
        if(profileData?.savedPosts?.length){
            const savedPosts = await getSavedPosts()
            if(savedPosts){
                setSaved(savedPosts)
            }else if(savedPosts?.message === 'Token expired'){
                dispatch(userSignOut())
                navigate('/')
                toast.error(savedPosts.message)
            }
        }
    }
    
    const handleOpenProfile = () => setOpenProfile(!openProfile)

    const handleOpenImg = () => {
        setProfilePhoto(null)
        setOpen(!open)
    }
    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>)=>{

        const file = e.target?.files?.[0]
        if(file){
            setProfilePhoto(file)
            setSubmitState(false)
            // setProfileImg(URL.createObjectURL(file))
            // const reader = new FileReader();
            // reader.onload = () => {
            //     setProfileImg(reader.result as string);
            // }
            // reader.readAsDataURL(file)
        }
    }

 
    const submitProfilePhoto = async()=>{
        if(profilePhoto){
            setSubmitState(true)
            const response:any = await updateProfilePhoto(profilePhoto)
            setProfileImg(response?.data)
            dispatch(changePhoto(response?.data))
            handleOpenImg()
        }
        setProfilePhoto(null)
    }

    const followUnfollow = async()=>{
        const response = await followHandler(profileData?.userName)
        if(response && follow){
            profileData?.followers?.splice(profileData.followers.indexOf(userName),1)
        }else{
            profileData?.followers?.push(userName)
        }
        setFollow(!follow)
    }

    const followOpenHandle = (value:string)=>{
        setFollowOpen(!followOpen)
        setFolowFollowing(value)
    }

    return(
        <div className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} pb-1.5 min-h-screen flex flex-col items-center`}>
            <div className={`${darkMode ? "bg-blue-gray-200" : "bg-white"} fixed h-[calc(100vh-6rem)] shadow-xl w-[calc(100vw-1rem)] p-3 shadow-blue-gray mt-[5.6rem] rounded overflow-scroll lg:ml-64 lg:w-[calc(100vw-17rem)]`}>
                <div className="h-screen">
                    <div className="flex justify-between gap-4 flex-wrap">

                        <div className="ml-auto mr-auto flex justify-center items-center w-52 h-52">
                            {userName === profileData?.userName ? (<div onClick={handleOpenImg} className="cursor-pointer rounded-full overflow-hidden relative w-52 h-52 group">
                                <img className="h-full w-full object-cover relative" src={profileImg?.length ? (CLOUDINARY_PROFILE_PHOTO_URL+profileImg) : PROFILE_PHOTO} alt='Profile photo' />
                                <div className="group-hover:opacity-40 bg-blue-gray-800 absolute top-0 left-0 w-full h-full opacity-0 flex items-center justify-center">
                                    <PencilSquareIcon className="w-10 h-8 text-white rounded-full"></PencilSquareIcon>
                                </div>
                            </div>) : (<div className="rounded-full overflow-hidden relative w-52 h-52">
                            <img className="h-full w-full object-cover" src={profileData?.profilePic?.length ? (CLOUDINARY_PROFILE_PHOTO_URL+profileData.profilePic) : PROFILE_PHOTO} alt='Profile photo' />
                            </div>)}
                        </div>



                        {/* Showing  Followers & Following List */}

                        <div className="ml-auto mr-auto flex flex-col justify-around gap-4">
                            <h1 className="text-3xl capitalize">{profileData.firstName} {profileData.lastName}</h1>
                            <div className="flex gap-4">
                                <button onClick={()=>followOpenHandle('Followers')}><span className="text-light-blue-800">{profileData?.followers?.length}</span><span className="text-blue-gray-800"> followers</span></button>
                                <button onClick={()=>followOpenHandle('Following')}><span className="text-light-blue-800">{profileData?.following?.length}</span><span className="text-blue-gray-800"> following</span></button>
                            </div>

                            <Dialog open={followOpen} handler={followOpenHandle} size='xs' className="w-100 h-100 max-h-[25rem] overflow-scroll">
                              <h1 className="text-black text-center text-lg font-bold mt-2">{folowFollowing}</h1>
                              <DialogBody className="flex flex-col gap-1">
                                {folowFollowing === 'Followers' ? 
                                    profileData?.followers?.map((person:string,index:number)=><FollowersList person={person} setFollowOpen={setFollowOpen} key={index} />)
                                : 
                                    profileData?.following?.map((person:string,index:number)=><FollowersList person={person} setFollowOpen={setFollowOpen} key={index} />)
                                }
                              </DialogBody>
                              
                            </Dialog>


                            <p className="mt-2">@{profileData.userName}</p>
                            <p className="whitespace-pre-line text-blue-gray-800">About me : {profileData.bio} Enjoying every moment in my life </p>
                            <div><span className="text-blue-gray-800">Total posts : </span><span className="text-light-blue-800">{profileData?.posts?.length}</span></div>
                        </div>
                        <div className="ml-auto mr-auto">
                            {userName === profileData?.userName ? <Button size="sm" onClick={handleOpenProfile} className="py-1 text-[.8rem] font-thin rounded-full capitalize">Edit Profile</Button> : follow ? <Button onClick={followUnfollow} size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize w-20">Unfollow</Button> : <Button onClick={followUnfollow} size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize w-20">Follow</Button>}
                            
                            
                            <Dialog
                                size="sm"
                                open={open}
                                handler={handleOpenImg}
                                animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0.9, y: -100 },
                              }}
                            >
                            <div className="flex justify-center items-center gap-2 m-4">

                                <div className="ml-auto mr-auto flex justify-center items-center w-52 h-52">  
                                    <div className="rounded-full overflow-hidden relative w-52 h-52 group">
                                        <img className="h-full w-full object-cover relative" src={profilePhoto ? (URL.createObjectURL(profilePhoto)) : (profileImg?.length) ? (CLOUDINARY_PROFILE_PHOTO_URL+profileImg) : PROFILE_PHOTO} alt='Profile photo' />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="w-40 bg-blue-500 hover:bg-blue-600 text-white text-center py-1 rounded-lg cursor-pointer">Choose
                                        <input className="hidden" onChange={handleImgChange} name='profilePic' type="file" accept=".jpg,.jpeg,.png" />
                                    </label>
                                    <p className="file-label">Allowed formats: JPG, JPEG, PNG</p>
                                </div>
                             </div>
                              
                            <div className="text-center p-2 space-x-2">
                                <Button onClick={handleOpenImg} size="lg" className="py-1 mt-2 capitalize font-thin">Cancel</Button>

                                <Button onClick={submitProfilePhoto} disabled={submitState} size="lg" className="py-1 mt-2 capitalize font-thin">Update</Button>
                            </div>
                              
                            </Dialog>

                        </div>
                    </div>
                    <div className="mt-2 w-full h-100">
                        <Tabs value="Images">
                            <TabsHeader>
                                <Tab value='Images'>
                                  <div className="flex items-center gap-2">
                                    <PhotoIcon className="w-5 h-5"/>
                                        Images
                                  </div>
                                </Tab>
                                <Tab value='Videos'>
                                  <div className="flex items-center gap-2">
                                    <FilmIcon className="w-5 h-5"/>
                                        Videos
                                  </div>
                                </Tab>
                                {userName === profileData?.userName ? (
                                <Tab value='Saved'>
                                  <div className="flex items-center gap-2">
                                    <BookmarkIcon className="w-5 h-5"/>
                                        Saved
                                  </div>
                                </Tab>) : null}
                            </TabsHeader>
                            {/* <TabsBody className="grid grid-cols-3 grid-rows-auto m-1 gap-1"> */}
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(250px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                {profileData?.posts?.map((post:postData) =>{
                                    post.profilePic = profilePic
                                    return post.imgVideoURL ? (
                                    <TabPanel key={post._id} value='Images' className="p-0">
                                        <SinglePostPhoto post={post} />
                                    </TabPanel>) : null})
                                }
                            </TabsBody>
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(250px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                <TabPanel value='Videos'>
                                    Videos
                                </TabPanel>
                            </TabsBody>
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(250px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                {saved.map((post:postData) =>{
                                    return post.imgVideoURL ? (
                                    <TabPanel key={post._id} value='Saved' className="p-0">
                                        <SinglePostPhoto post={post} />
                                    </TabPanel>) : null})
                                }
                            </TabsBody>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileBody