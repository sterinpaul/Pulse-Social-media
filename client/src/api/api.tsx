import axios from 'axios';
import { BASEURL } from './baseURL';

const baseURL = axios.create({
    baseURL : BASEURL
})

baseURL.interceptors.request.use(
    config=>{
        const state = localStorage.getItem("token")
        
        if(state){
            const {token} = JSON.parse(state)
            config.headers["Authorization"] = `Bearer ${token}`
        }else{
            delete config.headers["Authorization"]
        }

        return config
    },
    error=>{
        console.log('Interceptor encounted an error')
        return Promise.reject(error)
    }
)

export default baseURL