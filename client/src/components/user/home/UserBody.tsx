import { useState,useRef } from "react";
import { useSelector } from "react-redux";
import UserBodyPost from "./UserBodyPost";
import { Button } from "@material-tailwind/react";
import {PhotoIcon,PencilSquareIcon,NoSymbolIcon} from "@heroicons/react/24/outline";


interface Post{
    id:string,
    userName:string,
    img:File | null,
    text:string,
    liked:{id:string,userName:string}[],
    comments:object[],
    createdAt: Date
}

const UserBody = ()=>{
    const themeDark:Boolean = useSelector((store:any)=>store.user.darkMode)
    const [textData,setTextData] = useState("")
    const [upload,setUpload] = useState<File | null>(null)
    const [postArr,setPostArr] = useState<Post[]>([])
    const fileInput = useRef<HTMLInputElement | null>(null)
    

    const uploadFunction = ()=>{
        fileInput.current?.click()
    }

    const publishPost = ()=>{
        if(textData.trim().length || upload){
            setPostArr([...postArr,{
                id:"1",
                userName:"Sterin Paul",
                img:upload,
                text:textData,
                liked:[],
                comments:[],
                createdAt: new Date()
            }])
            setTextData("")
            setUpload(null)
        }
    }


    return (
        <div className={`${themeDark ? "bg-blue-gray-100" : "bg-gray-200"} pb-1.5 min-h-screen flex flex-col items-center`}>
            <div className={`${themeDark ? "bg-blue-gray-200" : "bg-white"} h-41 shadow-xl w-[calc(100vw-1rem)] p-3 shadow-blue-gray mt-[5.6rem] rounded overflow-y-hidden lg:w-[calc(100vw-33rem)]`}>
                <div className="flex gap-2 overflow-scroll p-1">
                    
                    <img className="w-10 h-10 rounded-full outline outline-1 outline-gray-600" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"/>
                    
                    <div className="flex flex-col w-full gap-3">
                        
                        <textarea onChange={(e)=>setTextData(e.target.value)} value={textData} className={`${themeDark ? "bg-blue-gray-100" : "bg-gray-200"} w-full resize-none h-24 border p-2 rounded-md outline outline-1 outline-gray-400 placeholder:text-brown-200`} placeholder="Enter your text" />
                        
                        <div className="flex gap-2 justify-end overflow-visible p-1">
                            <div>
                                <input ref={fileInput} accept=".jpg,.jpeg,.mp4,.mpeg,.gif,.png" onChange={(event:any)=>setUpload(event?.target?.files[0])} className="w-0 h-0" type="file"/>
                                <Button onClick={uploadFunction} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800">
                                  {upload ? <span className="flex gap-1"><span className="font-thin text-[.5rem]">{upload.name}</span><PencilSquareIcon className="h-4 w-4"/></span> : <PhotoIcon className="h-4 w-4"/>}
                                </Button>
                            </div>
                            <Button onClick={()=>setUpload(null)} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800"><NoSymbolIcon className="h-4 w-4"/></Button>
                            <Button size="sm" onClick={publishPost} className="rounded-full p-2 bg-gray-600 hover:bg-gray-800">Publish</Button>
                        </div>
                    </div>
                </div>
            </div>


            {postArr.sort((a:any,b:any)=>b.createdAt - a.createdAt).map((post)=>{
                return (<UserBodyPost {...post} key={post.createdAt.toString()}/>)
                })
            }

        </div>
    )
}

export default UserBody;