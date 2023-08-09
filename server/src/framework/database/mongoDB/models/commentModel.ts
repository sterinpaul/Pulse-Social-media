import {Schema,model} from 'mongoose';
import Post from './postModel'; 

const commentSchema = new Schema(
    {
        postId:{
            type:Schema.Types.ObjectId,
            ref:Post,
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        liked:[],
        reply:[]
    },
    {timestamps:true}
)
const Comment = model("Comments",commentSchema)
export default Comment