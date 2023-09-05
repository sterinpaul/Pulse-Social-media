import mongoose from "mongoose"
import User from "../models/userModel"

interface userInterface{
  firstName:string,
  lastName:string,
  userName:string,
  email:string,
  password:string,
  mobile:string
}
export const userRepositoryMongoDB = ()=>{

    const addUser = async(addedUser:userInterface)=>{
        const newUser = new User(addedUser)
        return await newUser.save()
    }

    const getUserByEmail = async(email:string)=>{
        return await User.findOne({email})
    }

    const getUserByUserName = async(userName:string)=>{
        return await User.aggregate([
            {
              $match: {
                userName
              }
            },
            {
              $lookup: {
                from: "posts",
                localField: "userName",
                foreignField: "postedUser",
                as: "posts",
              }
            }
          ]
        )
    }

    const getUserByMobile = async(mobile:string)=>{
        return await User.findOne({mobile})
    }

    const getUserByNameMailMobile = async(userData:string)=>{
        return await User.findOne({$or:[{userName:userData},{email:userData},{mobile:userData}]})
    }

    const postProfilePicture = async(userName:string,profilePic:string)=>{
        return await User.updateOne({userName},{$set:{profilePic}})
    }

    const followHandler = async(userName:string,followUser:string)=>{
      const session = await User.startSession()
      try{
        const followStatus = await User.findOne({userName:followUser,followers:{$elemMatch:{$eq:userName}}})
        const operations = []
        if(followStatus===null){
          operations.push(
            User.updateOne({userName},{$addToSet:{following:followUser}}),
            User.updateOne({userName:followUser},{$addToSet:{followers:userName}})
          )
        }else{
          operations.push(
            User.updateOne({userName},{$pull:{following:followUser}}),
            User.updateOne({userName:followUser},{$pull:{followers:userName}})
          )
        }

        const results = await Promise.allSettled(operations)
        const isSuccess = results.every((result) => result.status === 'fulfilled')
        if(isSuccess){
          await session.commitTransaction()
          session.endSession()
          return true
        }else{
          await session.abortTransaction()
          session.endSession()
          return false
        }

      }catch(error){
        await session.abortTransaction()
        session.endSession()
        console.log(error)
      }
    }

    const getPost = async(userName:string)=>{
      return await User.aggregate([
        {
          $match: {
            userName
          }
        },
        {
          $project: {
            following: {
              $concatArrays:[
                [userName],"$following"
              ]
            },
            _id: 0
          }
        },
        {
          $unwind: {
            path: "$following"
          }
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "postedUser",
            as: "result"
          }
        },
        {
          $unwind: {
            path: "$result"
          }
        },
        {
          $match: {
            "result.isBlocked": false
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "userName",
            as: "userData"
          }
        },
        {
          $unwind: {
            path: "$userData"
          }
        },
        {
          $project: {
            _id: "$result._id",
            postedUser: "$result.postedUser",
            profilePic: "$userData.profilePic",
            description: "$result.description",
            imgVideoURL: "$result.imgVideoURL",
            liked: "$result.liked",
            reports: "$result.reports",
            createdAt: "$result.createdAt",
            updatedAt: "$result.updatedAt"
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: 10
        }]
      )
    }

    const postSave = async(userName:string,postId:string)=>{
        try{
          const postID = new mongoose.Types.ObjectId(postId)
          const savedStatus = await User.findOne({userName,savedPosts:{$elemMatch:{$eq:postID}}})
          if(savedStatus===null){
            return await User.updateOne({userName},{$addToSet:{savedPosts:postID}})
          }else{
            return await User.updateOne({userName},{$pull:{savedPosts:postID}})
          }
        }catch(error){
          console.log(error)
        }
      }

    const userSavedPosts = async(userName:string)=>{
      try{
        const savedPosts = await User.aggregate([
          {
            $match: {
              userName
            }
          },
          {
            $unwind: {
              path: "$savedPosts"
            }
          },
          {
            $lookup: {
              from: "posts",
              localField: "savedPosts",
              foreignField: "_id",
              as: "result"
            }
          },
          {
            $unwind: {
              path: "$result"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "result.postedUser",
              foreignField: "userName",
              as: "response"
            }
          },
          {
            $unwind: {
              path: "$response"
            }
          },
          {
            $project: {
              result: {
                $mergeObjects: [
                  "$result",
                  {
                    profilePic: "$response.profilePic",
                  }
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              savedPosts: {
                $push: "$result"
              }
            }
          }
        ])
        
        if(savedPosts){
          return savedPosts[0].savedPosts
        }
      }catch(error){
        console.log(error)
      }
    }

    const userSearch = async(searchText:string)=>{
      const regex = new RegExp(searchText,'i')
      return await User.find({$or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}},{userName:{$regex:regex}}]},{firstName:1,lastName:1,userName:1,profilePic:1,followers:1}).limit(10)
    }

    return {
        addUser,
        getUserByEmail,
        getUserByUserName,
        getUserByMobile,
        getUserByNameMailMobile,
        getPost,
        postProfilePicture,
        followHandler,
        postSave,
        userSavedPosts,
        userSearch
    }
}

export type userRepositoryMongoDB = typeof userRepositoryMongoDB