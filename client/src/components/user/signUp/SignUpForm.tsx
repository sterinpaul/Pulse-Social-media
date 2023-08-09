import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import { signUp } from "../../../api/apiConnections/authConnection";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userRedux/userSlice";
import lodash from 'lodash'
import { auth } from "../../../api/services/firebaseConfig";
import { RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";

import {
  // Checkbox,
    Input,
    Button,
    Typography,
    Dialog,
    DialogBody,
  } from "@material-tailwind/react";

  
  
  const SignUpForm : React.FC = ()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otpError,setOtpError] = useState(false)
    const [otpVerificationContainer,setOtpVerificationContainer] = useState(true)
    const [open,setOpen] = useState(false)
    const [otp,setOtp] = useState('')
    
    useEffect(()=>{
      recaptchaRender()
    },[])
    
    const recaptchaRender = async()=>{
      try{
        auth.useDeviceLanguage()
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'captchaContainer', {
          'size': 'invisible',
          'callback': () => {}
        })
      }catch(error){
        console.log('Error in captcha',error)
      }
    }
    
    const handleOpen = ()=>{
      if(formik?.values?.mobile?.length === 10){
        setOpen(!open)
        const phoneNumber = `+91${formik?.values?.mobile}`
        const appVerifier = window.recaptchaVerifier
        
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult)=>{
          window.confirmationResult = confirmationResult
        }).catch((error)=>{
          console.log('Error; SMS not sent',error)
        })
      }
    }
    
    const handleVerifyOTP = () => {
      if(otp.length===6){
        confirmationResult
        .confirm(otp)
        .then(()=>{
          setOtpVerificationContainer(false)
          setTimeout(() => {
            setOpen(!open)
          }, 2000);
        })
        .catch(()=>{
          setOtpError(true)
        })
      }
    }

    const mobileNumberHandle = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const mobileValue = e.target.value.replace(/[^0-9]/g,'').slice(0,10)
      formik.setFieldValue('mobile', mobileValue)
    }
    const otpHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const otpNumber = e.target.value.replace(/[^0-9]/g,'').slice(0,6)
      setOtp(otpNumber)
    }

    const formik = useFormik({
      initialValues:{
        firstName:'',
        lastName:'',
        userName:'',
        email:'',
        password:'',
        rePassword:'',
        mobile: '',
        // agreeTerms: false
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .required('Required'),
      userName: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(1,'Must be 8 characters or more')
        .required('Required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Password not match')
        .required('Required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/,'Mobile number must be a 10-digit numeric value')
        .required('Required'),
      // agreeTerms: Yup.boolean()
      //   .oneOf([true], "You must agree to the terms and conditions")
    }),
    onSubmit: async(values) => {
      interface resp{
        status?:string,
        message?:string,
        token?:string,
        user?:{userName:string,_id:string,darkMode:boolean,profilePic:string}
      }
      
      const data = lodash.omit(values,'rePassword')
      const response:resp = await signUp(data)

      if(response?.status === 'success'){
        if(response?.token){
          const user = {
            _id:response?.user?._id,
            token:response?.token,
            userName:response?.user?.userName,
            darkMode:response?.user?.darkMode,
            profilePic:response?.user?.profilePic
          }
          localStorage.setItem("user",JSON.stringify(user))
          dispatch(setUser(user))
        }
        navigate('/')
        toast.success(response?.message)
      }else{
        toast.error(response?.message)
      }
    }
  })

    return(
      <form onSubmit={formik.handleSubmit}>
        
            <Typography variant="h3" color="blue" className="text-center pt-4">
              Sign Up
            </Typography>
            
            <div className="mt-8 mb-2 w-100 max-w-screen-lg">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                    <div>
                      <Input type="text" id="firstName" size="lg" label="First Name"
                      {...formik.getFieldProps('firstName')} />
                      <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.firstName && formik.errors.firstName ?
                        formik.errors.firstName : null}</p>
                    </div>

                    <div>
                      <Input type="text" id="lastName" size="lg" label="Last Name"
                      {...formik.getFieldProps('lastName')} />
                      <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.lastName && formik.errors.lastName ?
                        formik.errors.lastName : null}</p>
                    </div>
                </div>

                <div>
                <Input type="text" id="userName" size="lg" label="User Name" 
                {...formik.getFieldProps('userName')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.userName && formik.errors.userName ? 
                formik.errors.userName : null}</p>
                </div>

                <div>
                <Input type="email" id="email" size="lg" label="E-mail"
                {...formik.getFieldProps('email')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.email && formik.errors.email ? 
                  formik.errors.email : null}</p>
                </div>

                <div>
                <Input type="password" id="password" size="lg" label="Password"
                {...formik.getFieldProps('password')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.password && formik.errors.password ?
                  formik.errors.password : null}</p>
                </div>

                <div>
                <Input type="password" id="rePassword" size="lg" label="Re-type Password"
                {...formik.getFieldProps('rePassword')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.rePassword && formik.errors.rePassword ?
                  formik.errors.rePassword : null}</p>
                </div>

                <div>
                  <Input type="text" id="mobile" size="lg" label="Mobile" disabled={!otpVerificationContainer} value={formik.values.mobile} onChange={mobileNumberHandle} />
                {/* {...formik.getFieldProps('mobile')} */}
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.mobile && formik.errors.mobile ? 
                  formik.errors.mobile : null}</p>
                </div>
                <div id="captchaContainer"></div>

                {otpVerificationContainer ? <Button onClick={handleOpen} className="p-2 rounded-full w-28 ml-auto mr-auto capitalize"  variant="outlined" >Send OTP</Button> : <></>}
              </div>


              <Dialog open={open} handler={handleOpen} className="w-1/2" size="xs">
                <div className="flex items-center justify-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="m-3 h-5 w-5"
                    onClick={handleOpen}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                
                
                <div className="h-40">
                {otpVerificationContainer ? (
                <DialogBody className="flex flex-col items-center justify-center p-1">
                  <h1 className="text-lg text-black font-bold mb-1">OTP Sent</h1>
                  <div>
                    <Input type="text" className="" value={otp} onChange={otpHandler} label="Enter otp"/>
                  </div>
                  <p className="text-red-900 text-xs h-4">{otpError ? 'Invalid OTP' : ''}</p>
                  <Button className=" m-2 capitalize" size='sm' variant="gradient" color="green" onClick={handleVerifyOTP}>
                    Verify
                  </Button>
                </DialogBody>) : <div className="flex flex-col items-center justify-center pt-4">
                  <div className="w-16 h-16 bg-blue-400 rounded-full text-white text-4xl text-center flex justify-center items-center">✔</div>
                  <p className="p-2">OTP Verified</p>
                </div> }
                </div>

                {/* <DialogFooter className=""> */}
                  {/* <Button variant="outlined" color="red" onClick={handleOpen}>
                    close
                  </Button> */}
                {/* </DialogFooter> */}
              </Dialog>




              {/* <Checkbox
                label={
                  (
                    <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center font-normal"
                    >
                      I agree the
                      <a
                        href="#"
                        className="font-medium transition-colors text-blue-500"
                      >
                        &nbsp;Terms and Conditions
                      </a>
                    </Typography>
                  )
                }
                // checked={formik.values.agreeTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                containerProps={{ className: "-ml-2.5" }}
              />
              <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.agreeTerms && formik.errors.agreeTerms ? 
                  formik.errors.agreeTerms : null}</p> */}
              <Button type="submit" className="mt-2" disabled={otpVerificationContainer} color="blue" variant="gradient" fullWidth>
                Submit
              </Button>
              
            </div>
      </form>
    )
}

export default SignUpForm