import axios from 'axios';
import { BASEURL } from './baseURL';

const baseURL = axios.create({
    baseURL : BASEURL
})

baseURL.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        const userName = localStorage.getItem("userName")
        if(token){
            if(token){
                config.headers["Authorization"] = `Bearer ${token}`
                config.headers["x-user"] = userName
            }else{
                delete config.headers["Authorization"]
                delete config.headers["x-user"]
            }
        }
        return config
    },
    error=>{
        console.log('Interceptor encounted an error')
        return Promise.reject(error)
    }
)

export default baseURL