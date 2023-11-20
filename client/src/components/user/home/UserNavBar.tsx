import { changeMode, setNotifications, userSignOut } from "../../../redux/userRedux/userSlice";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { CLOUDINARY_PROFILE_PHOTO_URL, PROFILE_PHOTO } from "../../../api/baseURL";



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
  // ListItemSuffix,
  Chip,
  Popover,
  PopoverHandler,
  PopoverContent
} from "@material-tailwind/react";

import {
  UserCircleIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  PowerIcon,
  Bars2Icon,
  BellIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import moment from "moment";
import { NotificationInterface } from "../../../interfaces/userInterface";
import { getUserNotifications, removeSingleNotification } from "../../../api/apiConnections/userConnection";


interface Data {
  userName: string,
  darkMode: boolean,
  profilePic: string
}

interface UserLeftBarInterface {
  searchOpen: boolean,
  setSearchOpen: (value: boolean) => void,
  chatOpen: boolean,
  setChatOpen: (value: boolean) => void
}

function ProfileMenu({ userName, profilePic, darkMode }: Data): JSX.Element {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const signOut = () => {
    dispatch(userSignOut())
    toast.success("Signout success")
    navigate('/')
  }

  const getProfile = () => {
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
            src={profilePic ? (CLOUDINARY_PROFILE_PHOTO_URL + profilePic) : PROFILE_PHOTO}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className={darkMode ? "bg-blue-gray-200" : ""}>

        <MenuItem
          onClick={getProfile} className="flex items-center gap-2 rounded">
          <UserCircleIcon className="h-4 w-4" strokeWidth="2" />
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
          <PowerIcon className="h-4 w-4 text-red-500" strokeWidth="2" />
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
interface list {
  isOpen: boolean,
  searchOpen: boolean,
  setSearchOpen: (value: boolean) => void,
  chatOpen: boolean,
  setChatOpen: (value: boolean) => void
}

function NavList({ isOpen, searchOpen, setSearchOpen, chatOpen, setChatOpen }: list) {

  const receivedMessages = useSelector((store: { chat: { receivedMessages: [] } }) => store.chat.receivedMessages)
  const notifications = useSelector((store: { user: { notifications: [] } }) => store.user.notifications)
  const navigate = useNavigate()
  const [handlerOpenAndClose,setHandlerOpenAndClose] = useState(false)

  const uniqueArray = receivedMessages.reduce((accumulator: any, currentObject: any) => {
    
    // Check if the current object's "id" property already exists in the accumulator
    const exists = accumulator.some((obj: any) => obj.id === currentObject.id)
    
    // If it doesn't exist, add it to the accumulator
    if (!exists) {
      accumulator.push(currentObject)
    }
    return accumulator
  }, [])
  
  const dispatch = useDispatch()

  const removeNotification = async(id:string)=>{
    const response = await removeSingleNotification(id)
    if(response.status){
      const updatedNotifications = notifications.filter((message:{_id:string})=>message._id !== id)
      dispatch(setNotifications(updatedNotifications))
    }
  }
  const notificationHandler = ()=>{
    setHandlerOpenAndClose(open=>!open)
  }

  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}

      <Link to='/'>
        <Typography as="span" variant="small" color="blue-gray" className="font-normal">
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            <HomeIcon className="h-5 w-5" />
            {isOpen ? "Home" : null}
          </MenuItem>
        </Typography>
      </Link>

      {/* Notifications Menu */}
      <Typography as="span" variant="small" color="blue-gray" className="font-normal relative">
        {notifications.length ? <span className="absolute -top-1 left-6 text-xs text-center cursor-default text-white bg-blue-800 w-4 rounded-full">{notifications.length}</span> : <></>}
        <Popover placement="bottom-start" open={handlerOpenAndClose} handler={notificationHandler}>
          <PopoverHandler>
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              <BellIcon className="h-5 w-5" />
              {isOpen ? "Notifications" : ''}
            </MenuItem>
          </PopoverHandler>
          <PopoverContent className="p-1 max-h-72 overflow-y-scroll z-50">
            {notifications.length ? notifications.map((notification: NotificationInterface) => {
                return (
                  <MenuItem onClick={()=>{
                    notification.type === 'follows' ? navigate(`/${notification.user}`) : notification.type === 'message' ? setChatOpen(true): null
                    notificationHandler()
                    removeNotification(notification._id)
                    }
                  } key={notification._id} className="flex justify-between items-center gap-1">
                    <Avatar
                      variant="circular"
                      alt="Profile Pic"
                      src={notification.profilePic?.length ? (CLOUDINARY_PROFILE_PHOTO_URL+notification.profilePic) : PROFILE_PHOTO}
                    />
                    <div className="flex flex-col gap-1">
                      <Typography variant="small" color="gray" className="font-semibold">
                        {notification.type === 'follows' ? `${notification.user} ${notification.type} you` : `${notification.user} sent you a ${notification.type}`}
                      </Typography>
                      <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
                        <ClockIcon className="w-5 h-5" />
                        {moment(notification?.createdAt).startOf('minutes').fromNow()}
                      </Typography>
                    </div>
                    <div onClick={(event)=>{
                      event.stopPropagation()
                      removeNotification(notification._id)
                    }} className="hover:bg-gray-300 rounded-full">
                      <XMarkIcon className="w-5 h-5 "/>
                    </div>
                  </MenuItem>
                )
            }) : <p className="p-2 hover:outline-none">No Notifications</p>}
          </PopoverContent>
        </Popover>

      </Typography>



      {isOpen ? <><Typography as="span" variant="small" color="blue-gray" className="font-normal" onClick={() => setChatOpen(!chatOpen)}>
        <MenuItem className="flex items-center gap-2 lg:rounded-full">
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          Chat
          
          {uniqueArray?.length ? (
            <Chip value={uniqueArray?.length} size="sm" variant="ghost" color="blue-gray" className="rounded-full h-6 ml-4" />
          ) : <div className='h-6'></div>
          }
          
        </MenuItem>
      </Typography>

        <Typography as="span" variant="small" color="blue-gray" className="font-normal" onClick={() => setSearchOpen(!searchOpen)}>
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </MenuItem>
        </Typography>
      </> : null}
    </ul>
  );
}


export const UserNavBar: React.FC<UserLeftBarInterface> = ({ searchOpen, setSearchOpen, chatOpen, setChatOpen }) => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const { ...reduxData } = useSelector((store: { user: { userName: string, darkMode: boolean, profilePic: string } }) => store.user)
  const dispatch = useDispatch()

  const getNotifications = async()=>{
    const response = await getUserNotifications()
    if(response){
      dispatch(setNotifications(response))
    }
  }

  useEffect(()=>{
    getNotifications()
  },[])

  const changeTheme = () => {
    dispatch(changeMode())
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    )
  }, [])

  return (
    <div className='flex justify-center z-50'>
      <div className={`${reduxData.darkMode ? " bg-blue-gray-100" : "bg-gray-200"} z-10 fixed w-screen h-3`}></div>
      <Navbar className={`${reduxData.darkMode ? "bg-blue-gray-400" : ""} fixed mt-2 lg:w-5/6 lg:rounded-full lg:pl-6 z-50`} >
        <div className="relative mx-auto flex justify-between items-center text-blue-gray-900">

          {/* <Typography as="a" href="/" className="mr-4 ml-2 cursor-pointer py-1.5"> */}
          <Link to='/'><h1 className='font-kaushan text-4xl'>Pulz</h1></Link>
          {/* <div className='w-20'>
              <img src={img} alt="Logo"/>
            </div> */}
          {/* </Typography> */}

          <div className='flex justify-end items-center'>
            <div className="top-2/4 left-2/4 hidden -translate-2/4 lg:flex">
              <NavList isOpen={isNavOpen} searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
            </div>

            <div className='flex items-center justify-around'>

              <Typography as="span" onClick={() => changeTheme()} variant="small" color="blue-gray" className="font-normal px-2">
                <MenuItem className="flex items-center gap-2 rounded-full">
                  {reduxData.darkMode ? <SunIcon className="h-[18px] w-[18px]" /> : <MoonIcon className="h-[18px] w-[18px]" />}
                </MenuItem>
              </Typography>

              <ProfileMenu darkMode={reduxData.darkMode} userName={reduxData.userName} profilePic={reduxData.profilePic} />

              <IconButton size="sm" variant="text" onClick={toggleIsNavOpen} className="ml-auto mr-2 hover:bg-gray-300 lg:hidden">
                <Bars2Icon className="h-6 w-6 text-black" />
              </IconButton>

            </div>
          </div>
        </div>
        <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList isOpen={isNavOpen} searchOpen={searchOpen} setSearchOpen={setSearchOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
        </Collapse>
      </Navbar>
    </div>
  )
}


