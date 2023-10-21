import { Button, Card, CardBody, CardFooter, CardHeader, IconButton, Typography, Dialog } from "@material-tailwind/react";
import { postData } from "../../../interfaces/postInterface";
import { useEffect, useState } from "react";
import SingleReportedPost from "./SingleReportedPost";
import { reportedPosts } from "../../../api/apiConnections/adminConnection";

interface ReportsInterface{
  allReportedPosts:postData[],
  setAllReportedPosts:(data:postData[])=>void,
  setTotalReportedPostsCount:(value:number)=>void,
  totalReportedPostsCount:number
}

interface ReportedUser{
    userName:string,
    reason:string
}

const ReportedPosts:React.FC<ReportsInterface> = ({allReportedPosts,setAllReportedPosts,setTotalReportedPostsCount,totalReportedPostsCount})=>{
    // const [reason,setReason] = useState<string>('')
    const [reportedUsers,setReportedUsers] = useState<ReportedUser[]>([])
    const [postCountOpen,setPostCountOpen] = useState(false)
    const [pageCount,setPageCount] = useState<number[]>([])
    const [pageNumber,setPageNumber] = useState<number>(0)
  
    
  useEffect(()=>{
    if(totalReportedPostsCount !== 0){
      const newArr = new Array(Math.ceil(totalReportedPostsCount/6)).fill(0)
      setPageCount(newArr)
    }else{
      setPageCount([])
    }
  },[totalReportedPostsCount])


  const setOpenUserDialog = (reports:[{userName:string,reason:string}])=>{
    setReportedUsers(reports)
    setPostCountOpen(!postCountOpen)
  }

  const getReportedPosts = async(page:number)=>{
    setPageNumber(page)
    const response = await reportedPosts(page)
    if(response){
      setTotalReportedPostsCount(response.count)
      setAllReportedPosts(response.response)
    }
  }
  

    // const reasonHandler = (reason: SetStateAction<string>)=>{
    //     console.log('reas',reason)
    //     setReason(reason)
    // }

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <p className="font-bold text-xl text-center">
                Reported Posts
              </p>
            </CardHeader>
            <CardBody className="overflow-scroll px-0 pb-0">
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Image</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Posted User</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Reported Count</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Status</Typography>
                      </th>

                  </tr>
                </thead>
                <tbody>
                  {allReportedPosts.map((post) => {
                    return (
                        <SingleReportedPost key={post._id} post={post} setOpenUserDialog={setOpenUserDialog} />
                      )
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-2">
              <Button variant="outlined" size="sm" disabled={pageNumber===0 ? true : false} onClick={()=>getReportedPosts(pageNumber-1)}>
                {"<"}
              </Button>
              <div className="flex items-center gap-2">
                {pageCount?.map((_value,index)=>{
                  return (
                    <IconButton key={index} variant="outlined" size="sm" onClick={()=>getReportedPosts(index)}>
                      {index+1}
                    </IconButton>
                  )
                })
                }
                
                </div>
                <Button variant="outlined" size="sm" disabled={(pageNumber+1)===(pageCount.length) ? true : false} onClick={()=>getReportedPosts(pageNumber+1)}>
              {">"}
              </Button>
            </CardFooter>


            <Dialog size="xs" open={postCountOpen} handler={setPostCountOpen} className="outline-none">
                <div className="p-2 overflow-y-scroll">
                    {reportedUsers?.map((user:{userName:string,reason:string},index)=>{
                        return <div key={index} className="flex justify-between gap-1 p-1">
                            <p className="font-bold">{user.userName}</p>
                            <p className="px-1 text-white bg-gray-500 rounded">Reason : {user.reason}</p>
                        </div>
                    })}
                </div>
            </Dialog>
        </Card>
    )
}

export default ReportedPosts