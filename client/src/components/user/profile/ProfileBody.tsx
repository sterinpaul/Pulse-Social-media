import { useSelector,useDispatch } from "react-redux";
import { changePhoto } from "../../../redux/userRedux/userSlice";
// import { useNavigate } from "react-router-dom";
import { updateProfilePhoto } from "../../../api/apiConnections/userConnection";
import { PROFILE_PHOTO,CLOUDINARY_URL } from "../../../api/baseURL";
import { useState } from "react";
import {
    Button,
    Dialog
  } from "@material-tailwind/react"

interface profile{
    _id?: string,
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
    const {_id,userName,darkMode,profilePic} = useSelector((store:{user:{reduxUser:{userName:string,_id:string,darkMode:boolean,profilePic:string}}})=>store.user.reduxUser)
    const handleOpenImg = () => {
        setProfilePhoto(null)
        setOpen(!open)
    }

    const handleOpenProfile = () => setOpenProfile(!openProfile)
    const dispatch = useDispatch()
    
    // const navigate = useNavigate()
    
    // const editProfile = ()=>{

        // navigate(`/${userName}/edit`)
    // }


    const [profilePhoto,setProfilePhoto] = useState<File | null >(null)
    // const [profilePhoto,setProfilePhoto] = useState<Blob | MediaSource | null>()
    const [profileImg,setProfileImg] = useState<string>(CLOUDINARY_URL+profilePic)
    // const [loading, setLoading] = useState <true | false>(false)

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) =>{

        const file = e.target?.files?.[0]
        if(file){
            setProfilePhoto(file)
            setProfileImg(URL.createObjectURL(file))
            // const reader = new FileReader();
            // reader.onload = () => {
            //     setProfileImg(reader.result as string);
            // }
            // reader.readAsDataURL(file)
        }
    }

 
    const submitProfilePhoto = async()=>{
        if(profilePhoto){
            const response:any = await updateProfilePhoto(userName,profilePhoto)
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
                        <div className="ml-auto mr-auto">
                            <div className="relative w-52 overflow-hidden rounded-full">
                                <img className="rounded w-100" src={profilePic ? (CLOUDINARY_URL+profilePic) : PROFILE_PHOTO} alt='Profile photo' />
                                <div className="absolute bottom-2 left-[4.5rem]">
                                    <Button onClick={handleOpenImg} className="p-2 font-thin">Change</Button>
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
                            {_id === data._id ? <Button size="sm" onClick={handleOpenProfile} className="py-1 text-[.8rem] font-thin rounded-full capitalize">Edit Profile</Button> : <><Button size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize">Follow</Button><Button size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize">Unfollow</Button></>}
                            
                            
                            <Dialog
                                className=""
                                open={open}
                                handler={handleOpenImg}
                                animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0.9, y: -100 },
                              }}
                            >
                            <div className="flex justify-center items-center gap-2 m-4">
                              <div className="w-96 rounded-full text-center">
                                  <img
                                    src={profilePic ? profileImg : PROFILE_PHOTO}
                                    alt="Profile Photo"
                                    className="rounded-full object-cover object-center"
                                  />
                                </div>
                             <input onChange={handleImgChange} name='profilePic' type="file" accept=".jpg,.jpeg,.png"/>
                             </div>
                              
                              <div className="text-center p-2 space-x-2">
                                <Button onClick={handleOpenImg} size="lg" className="py-1 mt-2 capitalize font-thin">Cancel</Button>

                                <Button onClick={submitProfilePhoto} size="lg" className="py-1 mt-2 capitalize font-thin">Update</Button>
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