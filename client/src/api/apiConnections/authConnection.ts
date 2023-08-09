import baseURL from "../api";


interface SignupFormValues{
    firstName:string,
    lastName:string,
    userName:string,
    email:string,
    password:string,
    mobile:string
}

interface SignupFormResponse{
    message:string,
    status:string,
    user:object,
    token:string
}

interface SigninFormValues{
    userName:string,
    password:string
}

interface SigninFormResponse{
    message:string,
    status:string,
    user:object,
    token:string
}

export const signUp = async (values:SignupFormValues):Promise<object> =>{
    try{
        const response =  await baseURL.post<SignupFormResponse>('/auth/signup',values)
        return response?.data
       
    // Handling error
    }catch(error:any){
        throw new Error(error)
    }
}

export const signIn = async (values:SigninFormValues):Promise<object> =>{
    try{
        const response = await baseURL.post<SigninFormResponse>('/auth/signin',values)
        return response?.data
        
    // Handling error
    }catch(error:any){
        throw new Error(`Error while signing in : ${error}`)
    }
}