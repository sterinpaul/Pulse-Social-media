import mongoose from "mongoose"
import Admin from "../models/adminModel"
import User from "../models/userModel"
import Post from "../models/postModel"

interface adminInterface{
  email:string,
  password:string
}

export const adminRepositoryMongoDB = ()=>{

    const getAdminByEmail = async(email:string)=>{
      return await Admin.findOne({email})
    }

    const getPost = async()=>{
      return await User.find()
    }

    const getCount = async()=>{
      const totalUsers = await User.find({isBlocked:false}).count()
      const totalPosts = await Post.find({listed:true}).count()
      return {totalUsers,totalPosts}
    }

    const getAllReported = async()=>{
      const allReportedPosts = await User.find({isBlocked:false}).count()
      console.log(allReportedPosts)
      
      return allReportedPosts
    }


    const userSearch = async(searchText:string)=>{
      const regex = new RegExp(searchText,'i')
      return await User.find({$or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}},{userName:{$regex:regex}}]},{firstName:1,lastName:1,userName:1,profilePic:1,followers:1}).limit(10)
    }


    return {
        getAdminByEmail,
        getCount,
        getAllReported,
        getPost,
        userSearch
    }
}

export type adminRepositoryMongoDB = typeof adminRepositoryMongoDB