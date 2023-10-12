import { AdminDbInterface } from "../../repositories/adminDbRepository"
import { AuthServiceInterface } from "../../services/authServiceInterfaces"


export const adminSignIn = async(
    email:string,
    password:string,
    adminRepository:ReturnType<AdminDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    const data:any = await adminRepository.getAdminByEmail(email)
    if(!data){
        const adminData = {
            status:"failed",
            message:"Admin does not exist",
            // user:{},
            // token:''
        }
        return adminData
    }
    const isPassword = await authService.comparePassword(password,data?.password)
    if(!isPassword){
        const adminData = {
            status:"failed",
            message:"Password incorrect",
            // admin:{},
            // token:''
        }
        return adminData
    }
    const jwtToken = await authService.generateToken(data?._id?.toString())
    data.password = '';
    const adminData = {
        status:"success",
        message:"Sign in Success",
        admin:data,
        token:jwtToken
    }
    return adminData
}
