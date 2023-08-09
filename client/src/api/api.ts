import axios from 'axios';
import { BASEURL } from './baseURL';

const baseURL = axios.create({
    baseURL : BASEURL
})

baseURL.interceptors.request.use(
    config=>{
        const user = localStorage?.getItem("user")
        if(user){
            const {token} = JSON.parse(user)
            if(token?.length){
                config.headers["Authorization"] = `Bearer ${token}`
            }else{
                delete config.headers["Authorization"]
            }
        }
        // Check if the request contains an image file
        // if (config.data instanceof FormData) {
            
        //     for (const value of config.data.values()) {
        //         if (value instanceof File) {
                // Add the "Content-Type" header only for image files
        //         config.headers['Content-Type'] = 'multipart/form-data';
        //         break;
        //       }
        //     }
        // }

        return config
    },
    error=>{
        console.log('Interceptor encounted an error')
        return Promise.reject(error)
    }
)

export default baseURL