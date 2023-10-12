
import {
  Tabs,
  TabsHeader,
  Tab,
  TabPanel,
  TabsBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  // MagnifyingGlassIcon,
  UsersIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { adminSignOut } from "../../../redux/adminRedux/adminSlice";
import { useEffect, useState } from "react";
import { getTotalPostsAndUsers, reportedPosts } from "../../../api/apiConnections/adminConnection";
 
const AdminLeftSideBar = ()=> {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [totalUsers,setTotalUsers] = useState<number>(0)
  const [totalPosts,setTotalPosts] = useState<number>(0)

  const getTotal = async()=>{
    const response = await getTotalPostsAndUsers()
    if(response){
      setTotalUsers(response.totalUsers)
      setTotalPosts(response.totalPosts)
    }
  }

  useEffect(()=>{
    getTotal()
  },[])

  const getReportedPosts = async()=>{
    const response = await reportedPosts()
    console.log(response)
    
  }

  const logOuthandle = ()=>{
    dispatch(adminSignOut())
    navigate('/pulz/admin')
  }
 
  return (
    <div className="h-screen w-screen">
      <div>
        <div>
          <h1 className="m-4 h-8">Welcome Admin</h1>
        </div>
        <Tabs value="Dashboard" orientation="vertical">
            <TabsHeader className="">
                <Tab value='Dashboard' className="place-items-start">
                  <div className="flex items-center ml-6 gap-2 h-12 w-52">
                    <PresentationChartBarIcon className="w-5 h-5"/>
                    <div>Dashboard</div>
                  </div>
                </Tab>
                <Tab value='Users' className="place-items-start">
                  <div className="flex items-center ml-6 gap-2 h-12 w-52">
                    <UsersIcon className="w-5 h-5"/>
                    <div>Users</div>
                  </div>
                </Tab>
                <Tab value='Reports' className="place-items-start" onClick={getReportedPosts}>
                  <div className="flex items-center ml-6 gap-2 h-12 w-52">
                    <PhotoIcon className="w-5 h-5"/>
                    <div>Reports</div>
                  </div>
                </Tab>
                <Tab value='LogOut' className="place-items-start" onClick={logOuthandle}>
                  <div className="flex items-center ml-6 gap-2 h-12 w-52">
                    <PowerIcon className="w-5 h-5"/>
                    Log Out
                  </div>
                </Tab>
            </TabsHeader>
            
            {/* <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(230px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}> */}
            <TabsBody className="">
              <TabPanel value='Dashboard'>
                <div className=" flex flex-col items-center justify-center gap-8">
                  <div className="w-full lg:w-96 h-40 flex flex-col justify-center gap-2 text-center shadow-lg shadow-gray-500 text-xl text-black rounded">
                    <div>Total Users</div>
                    <div className="text-blue-900">{totalUsers}</div>
                  </div>
                  <div className="w-full lg:w-96 h-40 flex flex-col justify-center gap-2 text-center shadow-lg shadow-gray-500 text-xl text-black rounded">
                    <div>Total Posts</div>
                    <div className="text-blue-900">{totalPosts}</div>
                  </div>
                </div>
              </TabPanel>
            
              <TabPanel value='Users'>
                Users
              </TabPanel>
            
              <TabPanel value='Reports'>
                Reports
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
    </div>
  );
}

export default AdminLeftSideBar