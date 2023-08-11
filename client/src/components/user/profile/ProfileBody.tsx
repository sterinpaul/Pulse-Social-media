import { useSelector,useDispatch } from "react-redux";
import { changePhoto } from "../../../redux/userRedux/userSlice";
import { updateProfilePhoto } from "../../../api/apiConnections/userConnection";
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from "../../../api/baseURL";
import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Dialog
  } from "@material-tailwind/react"

interface profile{
    userName?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    isBlock?: boolean,
    darkMode?: boolean,
    profilePic?: string,
    gender?: string,
    city?: string,
    bio?:string,
    blockedByUsers?: object[],
    blockedUsers?: object[],
    followRequested?: object[],
    followRequests?: object[],
    followers?: object[],
    following?: object[],
    createdAt?: string,
    updatedAt?: string,
}

const ProfileBody = (data:profile)=>{
    const [open, setOpen] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const {userName,darkMode} = useSelector((store:{user:{userName:string,darkMode:boolean}})=>store.user)
    const handleOpenImg = () => {
        setProfilePhoto(null)
        setOpen(!open)
    }
    
    const handleOpenProfile = () => setOpenProfile(!openProfile)
    const dispatch = useDispatch()


    const [profilePhoto,setProfilePhoto] = useState<File | null>(null)
    const [submitState,setSubmitState] = useState(true)
    const [profileImg,setProfileImg] = useState(data?.profilePic)

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

    return(
        <div className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} pb-1.5 min-h-screen flex flex-col items-center`}>
            <div className={`${darkMode ? "bg-blue-gray-200" : "bg-white"} fixed h-[calc(100vh-6rem)] shadow-xl w-[calc(100vw-1rem)] p-3 shadow-blue-gray mt-[5.6rem] rounded overflow-scroll lg:ml-64 lg:w-[calc(100vw-17rem)]`}>
                <div className="h-screen">
                    <div className="flex justify-between gap-4 flex-wrap">

                        <div className="ml-auto mr-auto flex justify-center items-center w-52 h-52">
                            <div onClick={handleOpenImg} className="cursor-pointer rounded-full overflow-hidden relative w-52 h-52 group">
                            
                                <img className="h-full w-full object-cover relative" src={profileImg?.length ? (CLOUDINARY_PROFILE_PHOTO_URL+profileImg) : PROFILE_PHOTO} alt='Profile photo' />
                                <div className="group-hover:opacity-40 bg-blue-gray-800 absolute top-0 left-0 w-full h-full opacity-0 flex items-center justify-center">
                                    <PencilSquareIcon className="w-10 h-8 text-white rounded-full"></PencilSquareIcon>
                                </div>

                            </div>
                        </div>


                        <div className="ml-auto mr-auto flex flex-col justify-around gap-4">
                            <h1 className="text-3xl capitalize">{data.firstName} {data.lastName}</h1>
                            <div className="flex gap-4">
                                <div><span className="text-light-blue-800">{data?.followers?.length}</span><span className="text-blue-gray-800"> followers</span></div>
                                <div><span className="text-light-blue-800">{data?.followers?.length}</span><span className="text-blue-gray-800"> following</span></div>
                            </div>
                            <p className="mt-2">@{data.userName}</p>
                            <p className="whitespace-pre-line text-blue-gray-800">About me : {data.bio} Enjoying every moment in my life </p>
                            <div><span className="text-blue-gray-800">Total posts : </span><span className="text-light-blue-800">{120}</span></div>
                        </div>
                        <div className="ml-auto mr-auto">
                            {userName === data?.userName ? <Button size="sm" onClick={handleOpenProfile} className="py-1 text-[.8rem] font-thin rounded-full capitalize">Edit Profile</Button> : <><Button size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize">Follow</Button><Button size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize">Unfollow</Button></>}
                            
                            
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
                </div>
            </div>
        </div>
    )
}

export default ProfileBody