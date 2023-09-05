import {Schema,model} from 'mongoose';

// Schema of Post
const postSchema = new Schema(
    {
        postedUser:{
            type:String,
            required:true
        },
        listed:{
            type:Boolean,
            default:true
        },
        description:{
            type:String,
        },
        imgVideoURL:{
            type:String
        },
        isBlocked:{
            type:Boolean,
            default:false
        },
        liked:[],
        reports:[],
    },
    {timestamps:true}
)
const Post = model("Post",postSchema)
export default Post