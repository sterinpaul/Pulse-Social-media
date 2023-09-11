import { useDispatch, useSelector } from "react-redux"
import { changePhoto } from "../../../redux/userRedux/userSlice";
// import { PROFILE_PHOTO } from "../../../api/baseURL"
import React,{ useState } from "react"
// import cloudinaryConfig from "../../../api/services/cloudinaryConfig";
import {
    Card,
    CardHeader,
    CardFooter,
    Button,
  } from "@material-tailwind/react";

interface userData{
    userId?:string,
    userName?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    darkMode?: boolean,
    profilePic?: string,
    gender?: string,
    city?: string,
    bio?:string
}

const EditProfileForm:React.FC = ()=>{
    const {
        darkMode,
        profilePic,
        
    } = useSelector((store:{user:{reduxUser:userData}})=>store.user.reduxUser)
    const dispatch = useDispatch()
    // const [profilePhoto,setProfilePhoto] = useState<File | null >(null)
    const [profilePhoto,setProfilePhoto] = useState<Blob | MediaSource >()
    const [profileImg,setProfileImg] = useState<string| null>(null)
    // const [loading, setLoading] = useState <true | false>(false)

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) =>{

        const file = e.target.files?.[0]
        if(file){
            setProfilePhoto(file)
            
            // const reader = new FileReader();
            // reader.onload = () => {
            //     setProfileImg(reader.result as string);
            // }
            // reader.readAsDataURL(file)
        }
    }

 
    const submitProfilePhoto = async()=>{
        if(profileImg){
            changePhoto(profileImg)
            dispatch(changePhoto(profileImg))
        }
        // setProfilePhoto(null)
        setProfileImg(null)
    }

    return(
        <div className={`${darkMode ? "bg-blue-gray-100" : "bg-gray-200"} pb-1.5 min-h-screen flex flex-col items-center`}>
            <div className={`${darkMode ? "bg-blue-gray-200" : "bg-white"} fixed h-[calc(100vh-6rem)] shadow-xl w-[calc(100vw-1rem)] p-3 shadow-blue-gray mt-[5.6rem] rounded overflow-scroll lg:ml-64 lg:w-[calc(100vw-17rem)]`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl mb-4">Edit Profile</h1>

                    <form>
                        <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="h-44 w-44 border-2 overflow-hidden rounded-full">
                                            <img className="object-cover object-center"  alt="Profile Photo"/>
                                            {/* <img className="object-cover object-center" src={profileImg ? profileImg : profilePic ? profilePic : PROFILE_PHOTO} alt="Profile Photo"/> */}
                                        </div>
                                    </td>
                                    <td className="pl-4">
                                        <div>
                                            <p className="pb-2">{profilePic ? "Change" : "Add"} profile photo</p>
                                            <input onChange={handleImgChange} type="file" accept=".jpg,.jpeg,.png"/>
                                            
                                        </div>
                                        <Button onClick={submitProfilePhoto} disabled={profileImg ? false : true} size="sm" className="py-1 mt-4 capitalize font-thin">Submit</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <div>
                            {profilePhoto ? <Card className="w-96 absolute shadow-xl">
                                <CardHeader shadow={true} floated={false} >
                                  <img
                                    src={URL.createObjectURL(profilePhoto)}
                                    alt="Profile Photo"
                                    className="h-full w-full object-cover"
                                  />
                                </CardHeader>

                                <CardFooter className="pt-1">
                                    <div className="text-center">
                                        <Button onClick={submitProfilePhoto} size="lg" className="py-1 mt-2 capitalize font-thin">Update</Button>
                                    </div>
                                </CardFooter>
                            </Card> : null}
                        </div>
                    </form>

                </div>
                
            </div>
            
        </div>
    )
}

export default EditProfileForm