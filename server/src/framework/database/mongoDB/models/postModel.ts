import {Schema,model} from 'mongoose';

// Schema of Post
const postSchema = new Schema(
    {
        postedUser:{
            type:String,
            required:true
        },
        description:{
            type:String,
        },
        imgVideoURL:{
            type:String,
            required:true
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