import { Button, Card, CardBody, CardFooter, CardHeader, IconButton, Input, Tab, Tabs, TabsHeader, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import SingleUser from "./SingleUser";
import { userProfile } from "../../../interfaces/userInterface";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getTotalUsers, searchUser } from "../../../api/apiConnections/adminConnection";
import { io,Socket } from "socket.io-client";
import { SOCKET_URL } from "../../../api/baseURL";


interface UserInterface{
  allUsers:userProfile[],
  setAllUsers:(users:[])=>void,
  setTotalCount:(value:number)=>void,
  totalCount:number
}

const UserManagement:React.FC<UserInterface> = ({allUsers,setAllUsers,setTotalCount,totalCount})=>{
    // const [reason,setReason] = useState<string>('')
  const [inputText,setInputText] = useState('')
  const [userId,setUserId] = useState('')
  const [pageCount,setPageCount] = useState<number[]>([])
  const [status,setStatus] = useState('all')
  const [pageNumber,setPageNumber] = useState<number>(0)
  const socket = useRef<Socket | null>(null)

  
  
  const userSearchByText = async(event:any)=>{
    setInputText(event.target.value)
    if(event.target.value.trim().length){
      const response = await searchUser(event.target.value,status,pageNumber)
      if(response){
        setAllUsers(response.response)
        setTotalCount(response.count)
      }
    }
  }
  
  
  useEffect(()=>{
    if(totalCount !== 0){
      const newArr = new Array(Math.ceil(totalCount/6)).fill(0)
      setPageCount(newArr)
    }else{
      setPageCount([])
    }
  },[totalCount])

  useEffect(()=>{
    socket.current = io(SOCKET_URL,{transports:['websocket']})
    return () => {
      if (socket?.current) {
        socket.current.disconnect()
      }
    }
  },[])

  useEffect(()=>{
    if(userId.length){
      socket.current?.emit('block-user',userId)
    }
    setUserId('')
  },[userId])

  const getAllUsers = async(userStatus:string,page:number)=>{
    setStatus(userStatus)
    setPageNumber(page)
    const response = await getTotalUsers(userStatus,page)
    if(response.response){
      setTotalCount(response.count)
      setAllUsers(response.response)
    }
  }


  const TABS = [
    {
      label: "All",
      value: "all",
      status: 'all'
    },
    {
      label: "Active",
      value: "active",
      status: 'false'
    },
    {
      label: "Blocked",
      value: "blocked",
      status: 'true'
    }
  ]


    // const setOpenUserDialog = (reports:[{userName:string,reason:string}])=>{
    //     setReportedUsers(reports)
    //     setPostCountOpen(!postCountOpen)
    // }
    

    // const reasonHandler = (reason: SetStateAction<string>)=>{
    //     console.log('reas',reason)
    //     setReason(reason)
    // }

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none ">
              <p className="font-bold text-xl text-center">
                Users
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-scroll">
                <Tabs value="all" className="w-full md:w-max overflow-x-scroll">
                  <TabsHeader>
                    {TABS.map(({ label, value,status }) => (
                      <Tab key={value} value={value} onClick={()=>getAllUsers(status,0)}>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    value={inputText}
                    onChange={userSearchByText}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="overflow-scroll px-0 pb-0">
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center" colSpan={2}>
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">User</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">E-mail</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Start date</Typography>
                      </th>

                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">Status</Typography>
                      </th>

                  </tr>
                </thead>
                <tbody>
                  {allUsers?.map((user) => {
                    return (
                        <SingleUser key={user._id} user={user} setUserId={setUserId} />
                      )
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-2">
              <Button variant="outlined" size="sm" disabled={pageNumber===0 ? true : false} onClick={()=>getAllUsers(status,pageNumber-1)}>
                {"<"}
              </Button>
              <div className="flex items-center gap-2">
                {pageCount?.map((_value,index)=>{
                  return (
                    <IconButton key={index} variant="outlined" size="sm" onClick={()=>getAllUsers(status,index)}>
                      {index+1}
                    </IconButton>
                  )
                })
                }
                </div>
              <Button variant="outlined" size="sm" disabled={(pageNumber+1)===(pageCount.length) ? true : false} onClick={()=>getAllUsers(status,pageNumber+1)}>
              {">"}
              </Button>
            </CardFooter>


            {/* <Dialog size="xs" open={postCountOpen} handler={setPostCountOpen} className="outline-none">
                <div className="p-2 overflow-y-scroll">
                    {reportedUsers?.map((user:{userName:string,reason:string},index)=>{
                        return <div key={index} className="flex justify-between gap-1 p-1">
                            <p className="font-bold">{user.userName}</p>
                            <p className="px-1 text-white bg-gray-500 rounded">Reason : {user.reason}</p>
                        </div>
                    })}
                </div>
            </Dialog> */}


        </Card>
    )
}

export default UserManagement