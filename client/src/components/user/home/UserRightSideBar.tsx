import { useSelector } from "react-redux";

const friendsList = [
    {
        fName:"Sunny",
        lName:"Lane"
    },
    {
        fName:"Mia",
        lName:"Khan"
    },
    {
        fName:"Avana",
        lName:"Adam"
    },
    {
        fName:"Ana",
        lName:"Armas"
    },
    {
        fName:"Samantha",
        lName:"Sunil"
    }
]

import {
    Card,
    Typography,
    ListItem,
    List
  } from "@material-tailwind/react";


   const UserRightSideBar = ()=>{
    const {darkMode} = useSelector((store:{user:{reduxUser:{userName:string,userId:string,darkMode:boolean}}})=>store.user.reduxUser)
    return (
      <Card className={`${darkMode ? "bg-blue-gray-200" : ""} fixed top-[5.6rem] h-[60vh] right-2 overflow-y-scroll max-w-[20rem] p-1 pb-1.5 rounded shadow-xl shadow-blue-gray hidden lg:block`}>
        <div className="text-center p-2">
          <Typography variant="h5" color="blue-gray">
            Recent Chat
          </Typography>
        </div>
        <List className="flex justify-center p-4">

        {friendsList.map((friend)=>{
            return(
                <ListItem key={friend.fName} className={`flex items-center justify-center p-2 w-52"`}>
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                      alt="nature image"
                    />
                    <p className="ml-4 w-28">{friend.fName} {friend.lName}</p>
                </ListItem>
            )
        })}
        </List>

      </Card>
    );
  }

export default UserRightSideBar
