import { Link } from "react-router-dom";
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    // Checkbox,
    Button,
  } from "@material-tailwind/react";

const SignInForm = ()=>{
  const formik = useFormik({
    initialValues:{
      userName:'',
      password:''
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      password: Yup.string()
        .min(8,'Must be 8 characters or more')
        .required('Required')
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  })

    return(
      <form onSubmit={formik.handleSubmit}>
        <Card className="w-96 shadow-2xl shadow-blue-gray-500">
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
                <Input type="string" label="User Name" size="lg"
                {...formik.getFieldProps('userName')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.userName && formik.errors.userName ? 
                formik.errors.userName : null}</p>

                <Input type="password" label="Password" size="lg"
                {...formik.getFieldProps('password')} />
                <p className="h-4 ml-2 text-sm text-red-800">{formik.touched.password && formik.errors.password ?
                  formik.errors.password : null}</p>
                {/* <div className="-ml-2.5"> */}
                  {/* <Checkbox label="Remember Me" /> */}
                {/* </div> */}
              </CardBody>
              <CardFooter className="pt-0">
                <Button color="blue" variant="gradient" fullWidth>
                  Sign In
                </Button>

                <div className="flex justify-center items-center gap-3 p-4">
                  <div className="w-full border-t-2 border-blue-gray-200 "></div>
                  <p className="text-blue-gray-300">OR</p>
                  <div className="w-full border-t-2 border-blue-gray-200 "></div>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant="outlined"
                    color="blue"
                    className="flex items-center gap-3"
                    >
                    <img src="https://www.material-tailwind.com/icons/google.svg" alt="metamask" className="h-6 w-6" />
                      Sign in with Google
                    </Button>
                </div>

                <Typography variant="small" className="mt-6 flex justify-center">
                  Don't have an account ?
                  <Link to="/signup" className="ml-1 text-blue-500 transition-colors hover:text-blue-700">Sign up</Link>
                </Typography>
              </CardFooter>
            </Card>
        </form>
    )
}

export default SignInForm