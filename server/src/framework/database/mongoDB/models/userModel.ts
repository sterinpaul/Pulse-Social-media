import {Schema,model} from 'mongoose';

// Schema of User
const userSchema = new Schema(
    {
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:false,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    profilePic:{
        type:String,
        default:''
    },
    mobile:{
        type:String,
        required:false
    },
    bio:{
        type:String
    },
    gender:{
        type:String
    },
    city:{
        type:String
    },
    darkMode:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    notifications:[],
    savedPosts:[],
    blockedUsers:[],
    blockedByUsers:[],
    followers:[],
    following:[],
    followRequests:[],
    followRequested:[],
    },
    {timestamps:true}
)

const User = model("User",userSchema)
export default User