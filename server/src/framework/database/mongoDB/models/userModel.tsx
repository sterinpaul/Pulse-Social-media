import mongoose,{Schema,model} from 'mongoose';

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
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    profilePic:{
        type:String
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
    isBlock:{
        type:Boolean,
        default:false
    },
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