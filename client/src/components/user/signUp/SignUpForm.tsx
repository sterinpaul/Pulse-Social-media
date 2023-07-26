import { useNavigate } from "react-router-dom";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import { signUp } from "../../../api/apiConnections/authConnection";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/userRedux/userSlice";

import {
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";

const SignUpForm = ()=>{
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
      firstName:'',
      lastName:'',
      userName:'',
      email:'',
      password:'',
      rePassword:''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      userName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(1,'Must be 8 characters or more')
        .required('Required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Password not match')
        .required('Required')
    }),
    onSubmit: async(values) => {
      interface resp{
        status?:string,
        message?:string,
        token?:string,
        user?:object
      }

      const response:resp = await signUp(values)

      
      if(response?.status === 'success'){
        dispatch(setToken(response?.token))
        navigate('/')
        toast.success(response?.message)
      }else{
        toast.error(response?.message)
      }
      // alert(JSON.stringify(values, null, 2));
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
                <Input type="text" id="userName" size="lg" label="User Name" 
                {...formik.getFieldProps('userName')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.userName && formik.errors.userName ? 
                formik.errors.userName : null}</p>

                <Input type="email" id="email" size="lg" label="E-mail"
                {...formik.getFieldProps('email')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.email && formik.errors.email ? 
                  formik.errors.email : null}</p>
                <Input type="password" id="password" size="lg" label="Password"
                {...formik.getFieldProps('password')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.password && formik.errors.password ?
                  formik.errors.password : null}</p>
                <Input type="password" id="rePassword" size="lg" label="Re-type Password"
                {...formik.getFieldProps('rePassword')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.rePassword && formik.errors.rePassword ?
                  formik.errors.rePassword : null}</p>
              </div>
              <Checkbox
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
                        className="font-medium transition-colors hover:text-blue-500"
                      >
                        &nbsp;Terms and Conditions
                      </a>
                    </Typography>
                  )
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Button type="submit" color="blue" variant="gradient" fullWidth>
                Submit
              </Button>
              
            </div>
      </form>
    )
}

export default SignUpForm