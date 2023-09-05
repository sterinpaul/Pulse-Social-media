import { changeMode,userSignOut } from "../../../redux/userRedux/userSlice";
import React from "react";
import { Link } from "react-router-dom";
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { CLOUDINARY_PROFILE_PHOTO_URL,PROFILE_PHOTO } from "../../../api/baseURL";

import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";

import {
  UserCircleIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  PowerIcon,
  Bars2Icon,
  BellIcon,
  HomeIcon
} from "@heroicons/react/24/outline";


interface Data{
  userName:string,
  darkMode:boolean,
  profilePic:string
}
 
function ProfileMenu({userName,profilePic,darkMode}:Data): JSX.Element {
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const signOut = ()=>{
    dispatch(userSignOut())
    toast.success("Signout success")
    navigate('/')
  }

  const getProfile = ()=>{
    navigate(`/${userName}`)
  }

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="Profile photo"
            className="border border-blue-500 p-0.5"
            src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL+profilePic) : PROFILE_PHOTO}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className={darkMode ? "bg-blue-gray-200" : ""}>
            
              <MenuItem
              onClick={getProfile} className="flex items-center gap-2 rounded">
              <UserCircleIcon className="h-4 w-4" strokeWidth="2"/>
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color="inherit">
                My Profile
              </Typography>
              </MenuItem>
            

            <MenuItem
              onClick={signOut}
              className="flex items-center gap-2 rounded">
              <PowerIcon className="h-4 w-4 text-red-500" strokeWidth="2"/>
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color="red">
                Sign Out
              </Typography>
            </MenuItem>
        
      </MenuList>
    </Menu>
  );
}
 
 
// nav list component
interface list{
  isOpen:Boolean
}
 
function NavList(open: list) {
    
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}

          <Link to='/'>
            <Typography as="span" variant="small" color="blue-gray" className="font-normal">
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
              <HomeIcon className="h-[18px] w-[18px]"/>
              {open.isOpen ? "Home" : null}
              </MenuItem>
            </Typography>
          </Link>
        
          <Link to='#'>
            <Typography as="span" variant="small" color="blue-gray" className="font-normal">
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
              <BellIcon className="h-[18px] w-[18px]"/>
              {open.isOpen ? "Notifications" : null}
              </MenuItem>
            </Typography>
          </Link>
    </ul>
  );
}

 
export default function UserNavBar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const {...reduxData} = useSelector((store:{user:{userName:string,darkMode:boolean,profilePic:string}})=>store.user)
  const dispatch = useDispatch()
  

  const changeTheme = ()=>{
    dispatch(changeMode())
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);
 
  return (
    <div className='flex justify-center z-50'>
      <div className={`${reduxData.darkMode ? " bg-blue-gray-100" : "bg-gray-200"} z-10 fixed w-screen h-3`}></div>
      <Navbar className={`${reduxData.darkMode ? "bg-blue-gray-400" : ""} fixed mt-2 lg:w-5/6 lg:rounded-full lg:pl-6 z-50`} >
        <div className="relative mx-auto flex justify-between items-center text-blue-gray-900">

          {/* <Typography as="a" href="/" className="mr-4 ml-2 cursor-pointer py-1.5"> */}
            <Link to='/'><h1 className='font-kaushan text-4xl'>Pulse</h1></Link>
            {/* <div className='w-20'>
              <img src={img} alt="Logo"/>
            </div> */}
          {/* </Typography> */}

          <div className='flex justify-end items-center'>
              <div className="top-2/4 left-2/4 hidden -translate-2/4 lg:flex">
                <NavList isOpen={isNavOpen}/>
              </div>

              <div className='flex items-center justify-around'>

                  <Typography as="span" onClick={()=>changeTheme()} variant="small" color="blue-gray" className="font-normal px-2">
                    <MenuItem className="flex items-center gap-2 rounded-full">
                      {reduxData.darkMode ? <SunIcon className="h-[18px] w-[18px]"/> : <MoonIcon className="h-[18px] w-[18px]"/>}
                    </MenuItem>
                  </Typography>

                  <ProfileMenu darkMode={reduxData.darkMode} userName={reduxData.userName} profilePic={reduxData.profilePic}/>
                  
                  <IconButton size="sm" variant="text" onClick={toggleIsNavOpen} className="ml-auto mr-2 hover:bg-gray-300 lg:hidden">
                    <Bars2Icon className="h-6 w-6 text-black" />
                  </IconButton>

              </div>
          </div>
        </div>
        <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList  isOpen={isNavOpen}/>
        </Collapse>
      </Navbar>
    </div>
  )
}


