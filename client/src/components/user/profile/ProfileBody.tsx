import { useSelector,useDispatch } from "react-redux";
import { changePhoto, setUserName } from "../../../redux/userRedux/userSlice";
import { updateProfilePhoto, userNameChange,updateProfileData } from "../../../api/apiConnections/userConnection";
import { PROFILE_PHOTO,CLOUDINARY_PROFILE_PHOTO_URL } from "../../../api/baseURL";
import { useState } from "react";
import { followHandler } from "../../../api/apiConnections/userConnection";
import { postData } from "../../../interfaces/postInterface";
import SinglePostPhoto from "./SinglePostPhoto";
import FollowersList from "./FollowersList";
import {toast} from 'react-toastify';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {
    Tabs,
    TabsHeader,
    TabsBody,
    TabPanel,
    Tab,
    Button,
    Dialog,
    DialogBody,
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Radio
} from "@material-tailwind/react";

import {
    PhotoIcon,
    FilmIcon,
    BookmarkIcon,
    PencilSquareIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";

import { useNavigate } from "react-router-dom";

//   interface profile{
//     _id:string,
//     userName: string,
//     firstName?: string,
//     lastName?: string,
//     email?: string,
//     mobile: string,
//     isBlock?: boolean,
//     darkMode?: boolean,
//     profilePic: string,
//     gender?: string,
//     city?: string,
//     bio?:string,
//     blockedByUsers?: [],
//     blockedUsers?: [],
//     followRequested?: [],
//     followRequests?: [],
//     followers?: string[],
//     following?: string[],
//     savedPosts?: object[],
//     createdAt?: string,
//     updatedAt?: string,
//     posts: postData[]
// }

interface ProfileBodyProps {
    profileData: any,
    saved:postData[]
  }

const ProfileBody:React.FC<ProfileBodyProps> = ({profileData,saved})=>{
    const [open, setOpen] = useState(false)
    const [followOpen,setFollowOpen] = useState(false)
    // const [openProfile, setOpenProfile] = useState(false)
    const {userName,profilePic,darkMode} = useSelector((store:{user:{userName:string,profilePic:string,darkMode:boolean}})=>store.user)
    const dispatch = useDispatch()
    const [profilePhoto,setProfilePhoto] = useState<File | null>(null)
    const [submitState,setSubmitState] = useState(true)
    const [profileImg,setProfileImg] = useState(profilePic)
    const followersStatus = profileData?.followers?.includes(userName)
    const [follow,setFollow] = useState(followersStatus)
    const [folowFollowing,setFolowFollowing] = useState('')
    const [openProfileEdit, setOpenProfileEdit] = useState(false)
    const [userChangeStatus,setUserChangeStatus] = useState(false)
    const [updatedUserName,setUpdatedUserName] = useState('')
    const [userNameError,setUserNameError] = useState('')
    const navigate = useNavigate()

    const handleProfileEditOpen = () => {
        setUserChangeStatus(false)
        setOpenProfileEdit((cur) => !cur)
    }
    
    // const handleOpenProfile = () => setOpenProfile(!openProfile)

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

    const updateUserName = async(event: { preventDefault: () => void; })=>{
        event.preventDefault()
        if(updatedUserName.trim().length){
            const response = await userNameChange(updatedUserName)
            if(response?.status){
                profileData.userName = updatedUserName
                dispatch(setUserName(updatedUserName))
                setUserChangeStatus(!userChangeStatus)
                setUserNameError('success')
                navigate(`/${updatedUserName}`)
                setUpdatedUserName('')
            }else{
                setUserNameError('failed')
            }
            setTimeout(()=>{
                setUserNameError('')
            },3000)
        }
    }

    const genderHandle = (event:any)=>{
        formik.setFieldValue('gender',event.target.value)
    }

    const formik = useFormik({
        initialValues:{
          firstName:'',
          lastName:'',
          gender:'Male',
          city:'',
          bio:''
      },
      validationSchema: Yup.object({
        firstName: Yup.string()
            .max(20, 'Must be less than 20 characters')
            .required('Required'),
        lastName: Yup.string()
            .max(20, 'Must be less than 20 characters')
            .required('Required'),
        gender: Yup.string()
            .required('Required'),
        city: Yup.string()
            .max(20, 'Must be less than 20 characters')
            .required('Required'),
        bio: Yup.string()
            .max(50, 'Must be less than 50 characters')
            .required('Required')
      }),
      onSubmit: async(values) => {
        const response = await updateProfileData(values)
        if(response?.status){
            profileData.firstName = values.firstName
            profileData.lastName = values.lastName
            profileData.city = values.city
            profileData.bio = values.bio
            setOpenProfileEdit((cur) => !cur)
            toast.success("Profile updated successfully")
        }else{
          toast.error("Error occured while updating profile")
        }
      }
    })

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
                            <h1 className="text-3xl capitalize">{profileData?.firstName} {profileData?.lastName}</h1>
                            <div className="flex gap-4">
                                <button onClick={()=>followOpenHandle('Followers')}><span className="text-light-blue-800">{profileData?.followers?.length}</span><span className="text-blue-gray-800"> followers</span></button>
                                <button onClick={()=>followOpenHandle('Following')}><span className="text-light-blue-800">{profileData?.following?.length}</span><span className="text-blue-gray-800"> following</span></button>
                            </div>

                            <Dialog open={followOpen} handler={followOpenHandle} size='xs' className="w-100 h-100 max-h-[25rem] overflow-scroll">
                              <h1 className="text-black text-center text-lg font-bold mt-2">{folowFollowing}</h1>
                              {folowFollowing!=='' ? <DialogBody className="flex flex-col gap-1">
                                {folowFollowing === 'Followers' ? 
                                    profileData?.followers?.map((person:string,index:number)=><FollowersList person={person} setFollowOpen={setFollowOpen} key={index} />)
                                : 
                                    profileData?.following?.map((person:string,index:number)=><FollowersList person={person} setFollowOpen={setFollowOpen} key={index} />)
                                }
                              </DialogBody> : null}
                              
                            </Dialog>


                            <p className="mt-2">@{profileData?.userName}</p>
                            <p className="whitespace-pre-line text-blue-gray-800">About me : {profileData?.bio} </p>
                            <div><span className="text-blue-gray-800">Total posts : </span><span className="text-light-blue-800">{profileData?.posts?.length}</span></div>
                        </div>
                        <div className="ml-auto mr-auto">
                            {userName === profileData?.userName ? <Button size="sm" onClick={handleProfileEditOpen} className="py-1 text-[.8rem] font-thin rounded-full capitalize">Edit Profile</Button> : follow ? <Button onClick={followUnfollow} size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize w-20">Unfollow</Button> : <Button onClick={followUnfollow} size="sm" className="py-1 text-[.8rem] font-thin rounded-full capitalize w-20">Follow</Button>}
                            
                            

                            <Dialog
                              size="sm"
                              open={openProfileEdit}
                              handler={handleProfileEditOpen}
                              className="bg-transparent shadow-none"
                            >
                              <Card className="mx-auto w-full">
                                <CardHeader
                                  variant="gradient"
                                  className="h-28 w-28 mx-auto cursor-pointer"
                                  onClick={handleOpenImg}
                                >
                                    <img className="h-full w-full object-cover" src={profileImg?.length ? (CLOUDINARY_PROFILE_PHOTO_URL+profileImg) : PROFILE_PHOTO}/>
                                </CardHeader>
                                <h1 className="text-center text-black text-xl">Update Profile</h1>
                                <form onSubmit={formik.handleSubmit}>
                                    <CardBody className="flex flex-col p-0 m-auto gap-1 w-96">
                                        <div>
                                            <div className="flex gap-1 justify-between items-center h-12">
                                                {userChangeStatus ? <Input type="text" maxLength={20} id="userName" onChange={(event)=>setUpdatedUserName(event.target.value)} label="User Name" /> : <p className="pl-4">{profileData?.userName}</p>}
                                                {userChangeStatus ? <><button onClick={updateUserName} >Update</button><button className="ml-1" onClick={()=>setUserChangeStatus(!userChangeStatus)}><ArrowPathIcon className="w-6 h-6" /></button></> : <button onClick={()=>setUserChangeStatus(!userChangeStatus)}><PencilSquareIcon className="w-6 h-6"/></button>}
                                            </div>
                                            {userNameError==='success' ? <p className="text-sm text-center text-green-800 h-6">✓ User Name Changed Successfully</p> : userNameError==='failed' ? <p className="text-sm p-0 text-center text-red-800 h-6">User Name already exists</p> : <p className="h-6"></p>}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {/* <Input type="text" id="firstName" label="First Name" value={profileData?.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} /> */}
                                            <Input type="text" id="firstName" label="First Name" {...formik.getFieldProps('firstName')} />
                                            <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.firstName && formik.errors.firstName ?
                        formik.errors.firstName : null}</p>
                                            <Input type="text" id="lastName" label="Last Name" {...formik.getFieldProps('lastName')} />
                                            <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.lastName && formik.errors.lastName ?
                        formik.errors.lastName : null}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Radio id="male" label="Male" name="gender" defaultChecked ></Radio>
                                            <Radio id="female" label="Female" name="gender" onClick={genderHandle} ></Radio>
                                            <Radio id="other" label="Prefer not to say" name="gender" onClick={genderHandle} ></Radio>
                                        </div>

                                        <Input type="text" id="city" label="City" {...formik.getFieldProps('city')} />
                                        <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.city && formik.errors.city ?
                        formik.errors.city : null}</p>
                                        <Input type="text" id="bio" label="Bio" {...formik.getFieldProps('bio')} />
                                        <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.bio && formik.errors.bio ?
                        formik.errors.bio : null}</p>
                                    </CardBody>

                                    <CardFooter className="pt-0 flex justify-center gap-4">
                                        <Button type='submit' size='sm' className="py-1 capitalize text-lg font-thin" variant="gradient">
                                            Update
                                        </Button>
                                        <Button size='sm' className="py-1 capitalize text-lg font-thin" variant="gradient" onClick={handleProfileEditOpen} >
                                            Cancel
                                        </Button>
                                    </CardFooter>
                                </form>
                              </Card>
                            </Dialog>

                            <Dialog
                                size="xs"
                                open={open}
                                handler={handleOpenImg}
                                animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0.9, y: -100 },
                                }}>
                                    
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
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(230px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                {profileData?.posts ? (profileData?.posts?.map((post:postData) =>{
                                    post.profilePic = profilePic
                                    return (
                                    <TabPanel key={post._id} value='Images' className="p-0 w-full h-full max-h-72">
                                        <SinglePostPhoto post={post} />
                                    </TabPanel>)
                                })) : <></>}
                            </TabsBody>
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(230px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                <TabPanel value='Videos'>
                                    Videos
                                </TabPanel>
                            </TabsBody>
                            <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(230px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}>
                                {saved.length ? (saved.map((post:postData) =>{
                                    return (
                                    <TabPanel key={post._id} value='Saved' className="p-0 w-full h-full max-h-72">
                                        <SinglePostPhoto post={post} />
                                    </TabPanel>
                                    )
                                })) : <></>}
                            </TabsBody>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileBody