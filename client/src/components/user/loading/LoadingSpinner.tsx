import { Spinner } from "@material-tailwind/react"

const LoadingSpinner = ()=>{
    return <div className="w-full h-full absolute bottom-0 left-0 bg-gray-200 opacity-60 flex items-center justify-center">
        <Spinner className="h-12 w-12 text-gray-900/0" />
    </div>
}

export default LoadingSpinner