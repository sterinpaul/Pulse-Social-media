import { useState } from "react";
import SignInForm from "../../components/user/signIn/SignInForn";
import SignUpForm from "../../components/user/signUp/SignUpForm";

import {
  Card
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
            <button className="mt-2">
              Don't have an account ?
              <span onClick={()=>setSignIn(!signIn)} className="ml-1 text-blue-500 transition-colors hover:text-blue-700">Sign up</span>
            </button>
            </>
             : 
            <>
            <SignUpForm/>
            <button className="mt-2">
              Already have an account ?
              <span onClick={()=>setSignIn(!signIn)} className="ml-1 text-blue-500 transition-colors hover:text-blue-700">Sign in</span>
            </button>
            </>
            }
            </Card>
        </div>
    );
  }

export default SignInAndSignUp;