import { useState } from "react";
import SignInForm from "../../components/user/signIn/SignInForn";
import SignUpForm from "../../components/user/signUp/SignUpForm";

import {
  Card,
  Typography,
} from "@material-tailwind/react";
   
  const SignInAndSignUp = ()=>{
    const [signIn,setSignIn] = useState(true)
    return (
        <div className="h-screen flex items-center justify-center">
          <Card className="w-100 p-4 shadow-2xl shadow-blue-gray-500">
          {/* <Card className="w-96 shadow-2xl shadow-blue-gray-500"> */}
          {signIn ? 
            <>
            <SignInForm/>
            <Typography variant="small" className="mt-2 flex justify-center">
              Don't have an account ?
              <span onClick={()=>setSignIn(!signIn)} className="ml-1 text-blue-500 transition-colors hover:text-blue-700 cursor-pointer">Sign up</span>
            </Typography>
            </>
             : 
            <>
            <SignUpForm/>
            <Typography variant="small" className="mt-2 flex justify-center">
              Already have an account ?
              <span onClick={()=>setSignIn(!signIn)} className="ml-1 text-blue-500 transition-colors hover:text-blue-700 cursor-pointer">Sign in</span>
            </Typography>
            </>
            }
            </Card>
        </div>
    );
  }

export default SignInAndSignUp;