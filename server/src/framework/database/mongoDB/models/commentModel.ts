import {Schema,model} from 'mongoose';
import Post from './postModel'; 

const commentSchema = new Schema(
    {
        commentedUser:{
            type:String,
            required:true
        },
        listed:{
            type:Boolean,
            default:true
        },
        postId:{
            type:Schema.Types.ObjectId,
            ref:Post,
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        reports:[],
        liked:[],
        reply:[]
    },
    {timestamps:true}
)
const Comment = model("Comments",commentSchema)
export default Comment