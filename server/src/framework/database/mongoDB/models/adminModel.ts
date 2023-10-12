import {Schema,model} from 'mongoose';

// Schema of User
const adminSchema = new Schema(
    {
        adminName:{
            type:String
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:false
        }
    },
    {timestamps:true}
)

const Admin = model("Admin",adminSchema)
export default Admin