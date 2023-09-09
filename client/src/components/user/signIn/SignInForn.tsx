import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { useDispatch } from 'react-redux';
import { auth,provider } from '../../../api/services/firebaseConfig';
import { signIn,signInWithGoogle,updateUserNameForGoogle } from "../../../api/apiConnections/authConnection";
import { setToken,setUser } from '../../../redux/userRedux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

import {
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    // Checkbox,
    Button,
    Dialog
  } from "@material-tailwind/react";

  interface resp{
    status?:string,
    message?:string,
    token?:string,
    user?:{userName:string,_id:string,darkMode:boolean,profilePic:string}
  }

  interface googleResp{
    status:string,
    message:string,
    token?:string,
    user:{
      firstName:string,
      lastName:string,
      email:string,
      mobile?:string,
      password:string,
      profilePic?:string,
      userName?:string,
      darkMode?:string
    }
  }

  interface userDataForGoogle{
    firstName:string,
    lastName:string,
    userName:string,
    email:string,
    mobile?:string
  }

const SignInForm = ()=>{
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userName,setUserName] = useState('')
  const [userDetails,setUserDetails] = useState<userDataForGoogle>({firstName:'',lastName:'',userName:'',email:'',mobile:''})
  const [userNameStatus,setUserNameStatus] = useState(false)
  const handleOpen = () =>{
    setUserNameError(false)
    setUserNameStatus(!userNameStatus)
  }
  const [userNameError,setUserNameError] = useState(false)

  const formik = useFormik({
    initialValues:{
      userName:'',
      password:''
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .min(1,'Must be 8 characters or more')
        .required('Required')
    }),
    onSubmit: async(values) => {
      
      const response:resp = await signIn(values)
      
      if(response?.status === 'success'){
        if(response?.token){
          const user = {
            userName:response?.user?.userName,
            darkMode:response?.user?.darkMode,
            profilePic:response?.user?.profilePic
          }
          dispatch(setToken(response?.token))
          dispatch(setUser(user))
        }
        navigate('/')
        toast.success(response?.message)
      }else{
        toast.error(response?.message)
      }
    }
  })

  const handleGoogleSignIn = ()=>{
    setUserNameError(true)
    signInWithPopup(auth,provider).then(async(data:any)=>{

      const userData = {
        firstName : data._tokenResponse.firstName,
        lastName : data._tokenResponse.lastName,
        userName :'',
        email : data._tokenResponse.email,
        mobile : data.user.phoneNumber
        // profilePic : data._tokenResponse.photoUrl
      }
      setUserDetails(userData)
      const response:googleResp = await signInWithGoogle(userData?.email)
      if(response?.status === 'success'){
        if(response?.token){
          const user = {
            userName:response?.user?.userName,
            darkMode:response?.user?.darkMode,
            profilePic:response?.user?.profilePic
          }
          dispatch(setToken(response?.token))
          dispatch(setUser(user))
        }
        navigate('/')
        toast.success(response?.message)
      }else{
        setUserNameStatus(true)
        setUserNameError(false)
      }
    })
  }

  const submitUserName = async(event:any)=>{
    event.preventDefault()
    if(userName.trim().length){
      userDetails.userName = userName
      const response = await updateUserNameForGoogle(userDetails)
      
      if(response?.status === 'success'){
        if(response?.token){
          const user = {
            userName:response?.user?.userName,
            darkMode:response?.user?.darkMode,
            profilePic:response?.user?.profilePic
          }
          dispatch(setToken(response?.token))
          dispatch(setUser(user))
        }
        navigate('/')
        toast.success(response?.message)
        setUserNameStatus(false)
        setUserNameError(false)
      }else{
        setUserNameError(true)
      }
    }
  }
  

    return(
      <>
        <form onSubmit={formik.handleSubmit}>

              <CardHeader
                variant="gradient"
                color="blue"
                className="mb-4 grid h-28 place-items-center"
              >

                <Typography variant="h1" color="white" className="font-kaushan">
                  Pulse
                </Typography>

              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                {/* <Input type="text" label="User Name" size="lg" id="userName" */}
                <input className='border-[.1rem] border-gray-400 rounded-md p-2 placeholder:text-sm focus:border-blue-600' placeholder='User Name/E-mail/Mobile' id="userName"
                {...formik.getFieldProps('userName')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.userName && formik.errors.userName ? 
                formik.errors.userName : null}</p>

                <Input type="password" label="Password" size="lg" id="password"
                {...formik.getFieldProps('password')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.password && formik.errors.password ?
                  formik.errors.password : null}</p>
                {/* <div className="-ml-2.5"> */}
                  {/* <Checkbox label="Remember Me" /> */}
                {/* </div> */}
              </CardBody>
              <CardFooter className="pt-0">
                <Button type="submit" color="blue" variant="gradient" fullWidth>
                  Sign In
                </Button>

                <div className="flex justify-center items-center gap-3 p-4">
                  <div className="w-full border-t-2 border-blue-gray-200 "></div>
                  <p className="text-blue-gray-300">OR</p>
                  <div className="w-full border-t-2 border-blue-gray-200 "></div>
                </div>

                <div className="flex justify-center">
                  <Button disabled={userNameError} onClick={handleGoogleSignIn}
                    size="lg"
                    variant="outlined"
                    color="blue"
                    className="flex items-center gap-3"
                    >
                    <img src="https://www.material-tailwind.com/icons/google.svg" alt="metamask" className="h-6 w-6" />
                      Sign in with Google
                    </Button>
                </div>

              </CardFooter>
          </form>
        <Dialog open={userNameStatus} handler={handleOpen} size='xs' className='h-44'>
          <form onSubmit={submitUserName} className='flex flex-col items-center'>
            <h1 className='mt-4 text-black'>Please add User name to continue...</h1>
            <input maxLength={20} onChange={(event:any)=>setUserName(event.target.value)} type='text' value={userName} className='w-fit mt-4 p-1 bg-gray-200 rounded'></input>
            <p className='text-red-900 text-sm p-1 h-2'>{userNameError ? "User name already exists" : ''}</p>
            <Button type='submit' size='sm' className='capitalize mt-4'>Submit</Button>
          </form>
        </Dialog>
      </>
    )
}

export default SignInForm
