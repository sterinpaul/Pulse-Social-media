import { Link } from "react-router-dom";
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";

const SignUpForm = ()=>{
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
        .min(8,'Must be 8 characters or more')
        .required('Required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Password not match')
        .required('Required')
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  })

    return(
      <form onSubmit={formik.handleSubmit}>
        <Card className="w-100 p-4 shadow-2xl shadow-blue-gray-500">
            <Typography variant="h3" color="blue" className="text-center pt-4">
              Sign Up
            </Typography>
            
            <div className="mt-8 mb-2 w-100 max-w-screen-lg">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                    <div>
                      <Input type="text" size="lg" label="First Name"
                      {...formik.getFieldProps('firstName')} />
                      <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.firstName && formik.errors.firstName ?
                        formik.errors.firstName : null}</p>
                    </div>

                    <div>
                      <Input type="text" size="lg" label="Last Name"
                      {...formik.getFieldProps('lastName')} />
                      <p className="h-6 ml-2 text-sm text-red-800">{formik.touched.lastName && formik.errors.lastName ?
                        formik.errors.lastName : null}</p>
                    </div>
                </div>
                <Input type="text" size="lg" label="User Name" 
                {...formik.getFieldProps('userName')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.userName && formik.errors.userName ? 
                formik.errors.userName : null}</p>

                <Input type="email" size="lg" label="E-mail"
                {...formik.getFieldProps('email')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.email && formik.errors.email ? 
                  formik.errors.email : null}</p>
                <Input type="password" size="lg" label="Password"
                {...formik.getFieldProps('password')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.password && formik.errors.password ?
                  formik.errors.password : null}</p>
                <Input type="password" size="lg" label="Re-type Password"
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
              <Button color="blue" variant="gradient" fullWidth>
                Sign In
              </Button>
              <Typography variant="small" color="gray" className="mt-4 text-center font-normal">
                Already have an account ?
                <Link to="/signin" className="ml-1 text-blue-500 transition-colors hover:text-blue-700">Sign in</Link>
              </Typography>
            </div>
        </Card>
      </form>
    )
}

export default SignUpForm