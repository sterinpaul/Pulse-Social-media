import axios from 'axios';
import dotENV from 'dotenv';

dotENV.config()

const baseURL = axios.create({
    baseURL : process.env.BASE_URL
})

baseURL.interceptors.request.use(
    config=>{
        console.log("Entered into Interceptor")
        const state = localStorage.getItem("token")
        if(state){
            const {token} = JSON.parse(state)
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config
    },
    error=>{
        console.log('Interceptor encounted an error')
        return Promise.reject(error)
    }
)

export default baseURL