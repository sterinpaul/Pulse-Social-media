
import Admin from "../models/adminModel"
import User from "../models/userModel"
import Post from "../models/postModel"


export const adminRepositoryMongoDB = ()=>{

    const getAdminByEmail = async(email:string)=>{
      return await Admin.findOne({email})
    }

    
    const getCount = async()=>{
      const totalUsers = await User.countDocuments()

      const totalPosts = await Post.countDocuments({
        'reports': { $exists: true, $not: { $size: 0 } }
      })

      const usersReport = await User.aggregate(
        [
          {
            $match: {
              isBlocked: false
            }
          },
          {
            $project: {
              month: {
                $month: "$createdAt"
              }
            }
          },
          {
            $group: {
              _id: "$month",
              count: {
                $sum: 1
              }
            }
          },
          {
            $sort: {
              _id: 1
            }
          },
          {
            $project: {
              _id: 0,
              month: {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id"
                ]
              },
              count: 1
            }
          }
        ]
      )
      const postsReport = await Post.aggregate(
        [
          {
            $match: {
              listed: true,
            },
          },
          {
            $project: {
              month: {
                $month: "$createdAt",
              },
            },
          },
          {
            $group: {
              _id: "$month",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $project: {
              _id: 0,
              month: {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id",
                ],
              },
              count: 1,
            },
          },
        ]
      )
      return {totalUsers,totalPosts,usersReport,postsReport}
    }


    const allUsers = async(status:string,pageNumber:number)=>{
      if(status==='all'){
        const response = await User.find().sort({userName:1}).skip(pageNumber*6).limit(6)
        const count = await User.countDocuments()
        return {count,response}
      }else{
        const response = await User.find({isBlocked:status}).sort({userName:1}).skip(pageNumber*6).limit(6)
        const count = await User.countDocuments({isBlocked:status})
        return {count,response}
      }
    }
    
    const getAllReported = async(pageNumber:number)=>{
      const response = await Post.find({
        'reports': { $exists: true, $not: { $size: 0 } }
      }).skip(pageNumber*6).limit(6)

      const count = await Post.countDocuments({
        'reports': { $exists: true, $not: { $size: 0 } }
      })
      return {count,response}
    }
    
    const postBlockHandler = async(postId:string,status:boolean)=>{
      const response = await Post.updateOne({_id:postId},{$set:{listed:!status}})
      if(response.modifiedCount === 1) return true
    }

    const userBlockHandler = async(userId:string,status:boolean)=>{
      const response = await User.updateOne({_id:userId},{$set:{isBlocked:!status}})
      if(response.modifiedCount === 1) return true
    }

    const userSearch = async(searchText:string,status:string,pageNumber:number)=>{
      const regex = new RegExp(searchText,'i')
      const response = await User.find({$or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}},{userName:{$regex:regex}}]},{userName:1,profilePic:1,email:1,createdAt:1,isBlocked:1}).skip(pageNumber*6).limit(6)
      const count = await User.countDocuments({$or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}},{userName:{$regex:regex}}]})
      return {count,response}
    }


    return {
        getAdminByEmail,
        getCount,
        allUsers,
        getAllReported,
        postBlockHandler,
        userBlockHandler,
        userSearch
    }
}

export type adminRepositoryMongoDB = typeof adminRepositoryMongoDB