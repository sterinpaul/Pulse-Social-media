import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAdminToken } from '../../../redux/adminRedux/adminSlice';
import { adminSignIn } from '../../../api/apiConnections/authConnection';


import {
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    // Checkbox,
    Button,
    Card,
  } from "@material-tailwind/react";

  interface resp{
    status?:string,
    message?:string,
    token?:string,
    admin?:{adminName:string,_id:string}
  }

const AdminSignIn = ()=>{
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
        adminEmail:'',
        password:''
    },
    validationSchema: Yup.object({
      adminEmail: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Must be less than 20 characters')
        .min(8,'Must be 8 characters or more')
        .required('Required')
    }),
    onSubmit: async(values) => {
      
      const response:resp = await adminSignIn(values)
      
      if(response?.status === 'success'){
        if(response?.token){
        //   const admin = {
        //     adminEmail:response?.admin?.adminEmail,
        //     // darkMode:response?.admin?.darkMode,
        //     // profilePic:response?.admin?.profilePic,
        //     _id:response?.admin?._id
        //   }

          dispatch(setAdminToken(response?.token))
        }
        navigate('/pulz/admin')
        toast.success(response?.message)
      }else{
        toast.error(response?.message)
      }
    }
  })


    return(
      
      <div className="h-screen flex items-center justify-center">
          <Card className="w-100 p-4 shadow-2xl shadow-blue-gray-500">
            <form onSubmit={formik.handleSubmit}>

              <CardHeader
                variant="gradient"
                color="blue"
                className="mb-4 grid h-28 place-items-center"
              >

                <Typography variant="h1" color="white" className="font-kaushan">
                  Admin
                </Typography>

              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                {/* <Input type="text" label="Admin Name" size="lg" id="adminEmail" */}
                <input className='border-[.1rem] border-gray-400 rounded-md p-2 placeholder:text-sm focus:border-blue-600' placeholder='E-mail' id="email"
                {...formik.getFieldProps('adminEmail')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.adminEmail && formik.errors.adminEmail ? 
                formik.errors.adminEmail : null}</p>

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

              </CardFooter>
            </form>
          </Card>

      </div>
    )
}


export default AdminSignIn

