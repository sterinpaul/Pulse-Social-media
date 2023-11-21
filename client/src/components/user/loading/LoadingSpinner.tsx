// import { Spinner } from "@material-tailwind/react"

const LoadingSpinner = ()=>{
    return <div className="w-full h-full absolute bottom-0 left-0 bg-gray-200 opacity-60 flex items-center justify-center gap-1">
        {/* <Spinner className="h-12 w-12 text-gray-900/0" /> */}
        <div className="animate-mybounce w-2 h-2 bg-blue-800 rounded-full" style={{ animationDelay: '0.2s' }}></div>
        <div className="animate-mybounce w-2 h-2 bg-blue-800 rounded-full" style={{ animationDelay: '0.4s' }}></div>
        <div className="animate-mybounce w-2 h-2 bg-blue-800 rounded-full" style={{ animationDelay: '0.6s' }}></div>
        <div className="animate-mybounce w-2 h-2 bg-blue-800 rounded-full" style={{ animationDelay: '0.8s' }}></div>
    </div>
}

export default LoadingSpinner