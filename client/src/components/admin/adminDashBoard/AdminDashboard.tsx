
import {
  Tabs,
  TabsHeader,
  Tab,
  TabPanel,
  TabsBody,
  IconButton,
  Button,
  Collapse
} from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

import {
  UsersIcon,
  RectangleGroupIcon
} from "@heroicons/react/24/outline";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { adminSignOut } from "../../../redux/adminRedux/adminSlice";
import { useEffect, useRef, useState } from "react";
import { getTotalPostsAndUsers, getTotalUsers, reportedPosts } from "../../../api/apiConnections/adminConnection";
import AdminChart from "./AdminChart";
import ReportedPosts from "./ReportedPosts";
import { postData } from "../../../interfaces/postInterface";
import UserManagement from "./UserManagement";

interface ReportInterface{
  month:string,
  count:number
}

const AdminDashBoard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [openNav, setOpenNav] = useState(false)
  const [allReportedPosts,setAllReportedPosts] = useState<postData[]>([])
  const [allUsers,setAllUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalPosts, setTotalPosts] = useState<number>(0)
  const [totalCount,setTotalCount] = useState<number>(0)
  const [usersReport,setUsersReport] = useState<ReportInterface[]>([])
  const [postsReport,setPostsReport] = useState<ReportInterface[]>([])
  const [totalReportedPostsCount,setTotalReportedPostsCount] = useState<number>(0)
  const userRef = useRef<HTMLLIElement | null>(null)
  const postRef = useRef<HTMLLIElement | null>(null)
  

  const getTotal = async () => {
    const response = await getTotalPostsAndUsers()
    if (response) {
      setTotalUsers(response?.totalUsers)
      setTotalPosts(response?.totalPosts)
      setUsersReport(response?.usersReport)
      setPostsReport(response?.postsReport)
    }
  }

  useEffect(() => {
    getTotal()
  }, [])

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, [])

  const getAllUsers = async()=>{
    const response = await getTotalUsers('all',0)
    if(response){
      setTotalCount(response.count)
      setAllUsers(response.response)
    }
  }

  const getReportedPosts = async () => {
    const response = await reportedPosts(0)
    if(response){
      setTotalReportedPostsCount(response.count)
      setAllReportedPosts(response.response)
    }
  }


  const logOuthandle = () => {
    dispatch(adminSignOut())
    navigate('/pulz/admin')
  }

  // Data for the days of the week
  // const data = [
  //   { day: 'Monday', value: 4 },
  //   { day: 'Tuesday', value: 6 },
  //   { day: 'Wednesday', value: 3 },
  //   { day: 'Thursday', value: 7 },
  //   { day: 'Friday', value: 5 },
  //   { day: 'Saturday', value: 8 },
  //   { day: 'Sunday', value: 9 }
  // ]

  return (
    <div className="h-screen w-screen">

      <Collapse open={openNav}>
        <Button variant="gradient" size="sm" fullWidth className="mb-2">
          <span>Home</span>
        </Button>
      </Collapse>

      <Tabs value="Dashboard" orientation="vertical">
        
        <TabsHeader className="rounded-none min-h-screen lg:block">
          
          <div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>


            {/* <h1 className="m-6 h-8">Welcome Admin</h1> */}
          </div>
          <Tab value='Dashboard' className="place-items-start">
            <div className="flex items-center ml-6 gap-2 h-12 w-52">
              <PresentationChartBarIcon className="w-5 h-5" />
              <div>Dashboard</div>
            </div>
          </Tab>
          <Tab value='Users' ref={userRef} className="place-items-start" onClick={getAllUsers}>
            <div className="flex items-center ml-6 gap-2 h-12 w-52">
              <UsersIcon className="w-5 h-5" />
              <div>Users</div>
            </div>
          </Tab>
          <Tab value='Reports' ref={postRef} className="place-items-start" onClick={getReportedPosts}>
            <div className="flex items-center ml-6 gap-2 h-12 w-52">
              <RectangleGroupIcon className="w-5 h-5" />
              <div>Reports</div>
            </div>
          </Tab>
          <Tab value='LogOut' className="place-items-start" onClick={logOuthandle}>
            <div className="flex items-center ml-6 gap-2 h-12 w-52">
              <PowerIcon className="w-5 h-5" />
              Log Out
            </div>
          </Tab>
        </TabsHeader>

        {/* <TabsBody style={{display:'grid', gridTemplateColumns : 'repeat(auto-fill, minmax(230px,1fr))',gridGap:'5px',gridAutoFlow: 'dense'}}> */}
        <TabsBody>
          <TabPanel value='Dashboard' className="h-screen overflow-y-scroll">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div onClick={()=>userRef.current?.click()} className="w-96 h-40 flex flex-col justify-center gap-2 text-center shadow-lg shadow-gray-500 text-xl text-black rounded cursor-pointer">
                <div>Total Users</div>
                <div className="text-blue-900">{totalUsers}</div>
              </div>
              <div onClick={()=>postRef.current?.click()} className="w-96 h-40 flex flex-col justify-center gap-2 text-center shadow-lg shadow-gray-500 text-xl text-black rounded cursor-pointer">
                <div>Reported Posts</div>
                <div className="text-blue-900">{totalPosts}</div>
              </div>
            </div>
            <div>
              <AdminChart data={usersReport} chartType={'pie'} title={'User Registration'} />
              <AdminChart data={postsReport} chartType={'bar'} title={'Posts'} />
            </div>
          </TabPanel>

          <TabPanel value='Users'>
            <UserManagement allUsers={allUsers} setAllUsers={setAllUsers} setTotalCount={setTotalCount} totalCount={totalCount} />
          </TabPanel>

          <TabPanel value='Reports'>
            <ReportedPosts allReportedPosts={allReportedPosts} setAllReportedPosts={setAllReportedPosts} setTotalReportedPostsCount={setTotalReportedPostsCount} totalReportedPostsCount={totalReportedPostsCount} />
          </TabPanel>

        </TabsBody>
      </Tabs>
    </div>
  )
}

export default AdminDashBoard