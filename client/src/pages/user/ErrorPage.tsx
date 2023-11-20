import { Button } from "@material-tailwind/react"
import { useParams,useNavigate } from "react-router-dom"

const ErrorPage = ()=>{
    const {error,path} = useParams()
    const navigate = useNavigate()
    
    return(
        <div className="text-center mt-12">
            <h1 className="font-bold text-8xl ">{error}</h1>
            <p>Error while loading the page</p>
            <p>Please wait....</p>
            <Button onClick={()=>navigate(`/${path === 'home' ? '' : path}`)} className="capitalize font-thin text-md mt-4 py-2">Refresh</Button>
        </div>
    )
}

export default ErrorPage