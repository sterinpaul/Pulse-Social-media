import {
    ListItem,
    Typography,
  } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const FollowersList = ({ person, setFollowOpen }: { person: string; setFollowOpen: (value:boolean) => void })=>{
    const navigate = useNavigate()
    const goToProfile = ()=>{
        setFollowOpen(false)
        navigate(`/${person}`)
    }

    return (
        <ListItem onClick={goToProfile}>
          <div className="m-auto">
            <Typography variant="h6" color="blue-gray">
              {person}
            </Typography>
          </div>
        </ListItem>
    )
}

export default FollowersList