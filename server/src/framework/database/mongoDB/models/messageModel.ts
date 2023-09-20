import {Schema,model} from 'mongoose';

const messageSchema = new Schema(
    {
        chatId:{
            type:String
        },
        senderId:{
            type:String
        },
        message:{
            type:String
        }
    },{
        timestamps:true
    }
)

const Message = model("Message",messageSchema)
export default Message