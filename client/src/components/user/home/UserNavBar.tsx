import { changeMode, setToken } from "../../../redux/userRedux/userSlice";
import React from "react";
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

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


interface theme{
    props:Boolean
}
 
function ProfileMenu(themeMode:theme) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const closeMenu = () => setIsMenuOpen(false);
  
  const signOut = ()=>{
    localStorage.removeItem("token")
    dispatch(setToken(""))
    toast.success("Signout success")
    navigate('/')
  }

  const profile = ()=>{
    console.log("profile page")
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
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className={themeMode.props ? "bg-blue-gray-200" : ""}>
            <MenuItem
              onClick={()=>profile()}
              className="flex items-center gap-2 rounded">
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
              onClick={()=>signOut()}
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
 
// nav list menu
/*const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];
 
function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };
 
  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));
 
  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}
*/

 
// nav list component
interface list{
  isOpen:Boolean
}
 
function NavList(open: list) {
    
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}

      
            <Typography as="a" href="#" variant="small" color="blue-gray" className="font-normal">
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
              <HomeIcon className="h-[18px] w-[18px]"/>
              {open.isOpen ? "Home" : null}
              </MenuItem>
            </Typography>
        
        
            <Typography as="a" href="#" variant="small" color="blue-gray" className="font-normal">
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
              <BellIcon className="h-[18px] w-[18px]"/>
              {open.isOpen ? "Notifications" : null}
              </MenuItem>
            </Typography>

    </ul>
  );
}

 
export default function UserNavBar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const themeDark:Boolean = useSelector((store:{user:{darkMode:boolean}})=>store.user.darkMode)
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
      <div className={`${themeDark ? " bg-blue-gray-100" : "bg-gray-200"} z-10 fixed w-screen h-3`}></div>
      <Navbar className={`${themeDark ? "bg-blue-gray-400" : ""} fixed mt-2 lg:w-5/6 lg:rounded-full lg:pl-6 z-50`} >
        <div className="relative mx-auto flex justify-between items-center text-blue-gray-900">

          {/* <Typography as="a" href="/" className="mr-4 ml-2 cursor-pointer py-1.5"> */}
            <h1 className='font-kaushan text-4xl'>Pulse</h1>
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
                      {themeDark ? <SunIcon className="h-[18px] w-[18px]"/> : <MoonIcon className="h-[18px] w-[18px]"/>}
                    </MenuItem>
                  </Typography>

                  <ProfileMenu props={themeDark} />

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
  );
}


