import axios from 'axios';
import { BASEURL } from './baseURL';
import { toast } from 'react-toastify';

const baseURL = axios.create({
    // baseURL : process.env.BASE_URL
    baseURL : BASEURL
})

baseURL.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        const userName = localStorage.getItem("userName")

        const adminToken = localStorage.getItem("admin-token")
        
        if(token){
            config.headers["Authorization"] = `Bearer ${token}`
            config.headers["x-user"] = userName
        }else if(adminToken){
            config.headers["Authorization"] = `Bearer ${adminToken}`
        }else{
            delete config.headers["Authorization"]
            delete config.headers["x-user"]
        }
        return config
    },
    error=>{
        console.log('Request Interceptor encounted an error')
        return Promise.reject(error)
    }
)

baseURL.interceptors.response.use(
    config=>{
        const path = location.pathname.replace('/','')
        if(config.status){
            if(config.status !== 200){
                if(config.data?.message === 'Token expired'){
                    toast.error(config.data?.message)
                }else{
                    location.href = `/error/${config.status}/${path === '' ? 'home' : path}`
                }
            }
        }else{
            location.href = `/error/500/${path === '' ? 'home' : path}`
        }
        return config
    },
    error=>{
        console.log('Response Interceptor encounted an error')
        return Promise.reject(error)
    }
)

export default baseURL