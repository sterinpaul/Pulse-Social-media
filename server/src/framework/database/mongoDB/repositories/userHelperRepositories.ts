import mongoose from "mongoose"
import User from "../models/userModel"
import Post from "../models/postModel"
import Comment from "../models/commentModel"

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
        const userProfile =  await User.aggregate([
          {
            $match: {
              userName,
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "userName",
              foreignField: "postedUser",
              as: "posts",
            },
          },
          {
            $unwind: {
              path: "$posts",
            },
          },
          {
            $match: {
              "posts.listed": true,
            },
          },
          {
            $group: {
              _id: "$_id",
              firstName: {
                $first: "$firstName",
              },
              lastName: {
                $first: "$lastName",
              },
              userName: {
                $first: "$userName",
              },
              email: {
                $first: "$email",
              },
              profilePic: {
                $first: "$profilePic",
              },
              mobile: {
                $first: "$mobile",
              },
              bio: {
                $first: "$bio",
              },
              city: {
                $first: "$city",
              },
              savedPosts: {
                $first: "$savedPosts",
              },
              notifications: {
                $first: "$notifications",
              },
              blockedUsers: {
                $first: "$blockedUsers",
              },
              blockedByUsers: {
                $first: "$blockedByUsers",
              },
              followers: {
                $first: "$followers",
              },
              following: {
                $first: "$following",
              },
              followRequests: {
                $first: "$followRequests",
              },
              followRequested: {
                $first: "$followRequested",
              },
              createdAt: {
                $first: "$createdAt",
              },
              posts: {
                $push: "$posts",
              }
            }
          }
        ]
      )
      
      if(userProfile?.length){
        return userProfile[0]
      }else{
        const user = await User.findOne({userName})
        return user
      }
    }

    const getNotifications = async(userName:string)=>{
      return await User.aggregate([
        {
          $match: {
            userName
          },
        },
        {
          $unwind: {
            path: "$notifications",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort:{
            'notifications.createdAt':-1
          }
        },
        {
          $match: {
            "notifications.viewed": false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "notifications.user",
            foreignField: "userName",
            as: "notification",
          },
        },
        {
          $unwind: {
            path: "$notification",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$notifications._id",
            user: "$notifications.user",
            type: "$notifications.type",
            createdAt: "$notifications.createdAt",
            profilePic: "$notification.profilePic",
          },
        },
      ])
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
      // const session = await User.startSession()
      try{
        const followStatus = await User.findOne({userName:followUser,followers:{$elemMatch:{$eq:userName}}})
        let notificationData = {};
        const operations = []
        if(followStatus===null){
          notificationData = {
            _id:new mongoose.Types.ObjectId(),
            user:userName,
            type:'follows',
            viewed:false,
            createdAt:new Date()
          }
          operations.push(
            User.updateOne({userName},{$addToSet:{following:followUser}}),
            User.updateOne({userName:followUser},{$addToSet:{followers:userName}}),
            User.updateOne({userName:followUser},{$addToSet:{notifications:notificationData}})
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
          // await session.commitTransaction()
          // session.endSession()
          return notificationData
        }else{
          // await session.abortTransaction()
          // session.endSession()
          return false
        }

      }catch(error){
        // await session.abortTransaction()
        // session.endSession()
        console.log(error)
      }
    }

    const getPost = async(userName:string)=>{
      const allPosts = await User.aggregate([
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
            "result.listed":true
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
            listed: "$result.listed",
            isVideo: "$result.isVideo",
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
      if(allPosts.length){
        return allPosts
      }else{
        return await Post.aggregate([
          {
            $match: {
              listed: true
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "postedUser",
              foreignField: "userName",
              as: "result"
            }
          },
          {
            $unwind: {
              path: "$result"
            }
          },
          {
            $project: {
              _id: "$_id",
              postedUser: "$postedUser",
              profilePic: "$result.profilePic",
              description: "$description",
              listed:"$listed",
              isVideo: "$isVideo",
              imgVideoURL: "$imgVideoURL",
              liked: "$liked",
              reports: "$reports",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt"
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $limit: 10
          }
        ])
      }
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
            $match: {
              "result.listed": true
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
          return savedPosts[0]?.savedPosts
        }
      }catch(error){
        console.log(error)
      }
    }

    const userSearch = async(searchText:string)=>{
      const regex = new RegExp(searchText,'i')
      return await User.find({$or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}},{userName:{$regex:regex}}]},{firstName:1,lastName:1,userName:1,profilePic:1,followers:1}).limit(10)
    }

    const userNameUpdate = async(userName:string,newUserName:string)=>{
      newUserName = newUserName.toLowerCase()
      const userExist = await User.findOne({userName:newUserName})
      if(userExist){
        return false
      }else{
        const operations = [
          User.updateOne({userName},{$set:{userName:newUserName}}),
          Post.updateMany({postedUser:userName},{$set:{postedUser:newUserName}}),
          Comment.updateMany({commentedUser:userName},{$set:{commentedUser:newUserName}}),
          Comment.updateMany({"reply":{$elemMatch:{"commentedUser":userName}}},{$set:{"reply.$[].commentedUser":newUserName}}),
          Comment.updateMany({"reply":{$elemMatch:{"replyToUser":userName}}},{$set:{"reply.$[].replyToUser":newUserName}})
        ]
        const results = await Promise.allSettled(operations)
        const isSuccess = results.every((result) => result.status === 'fulfilled')
        if(isSuccess) return true
        
      }
    }

    const userProfileUpdate = async(
      userName:string,
      firstName:string,
      lastName:string,
      gender:string,
      city:string,
      bio:string
    )=>{
      userName = userName.toLowerCase()
      const response = await User.updateOne({userName},{$set:{firstName,lastName,gender,city,bio}})
      if(response.modifiedCount){
        return true
      }else{
        return false
      }
    }

    const removeUserNotification = async(userName:string,id:string)=>{
      const ID = new mongoose.Types.ObjectId(id)
      const response = await User.updateOne({userName,'notifications._id':ID},{$set:{'notifications.$.viewed':true}})
      if(response.modifiedCount){
        return true
      }else{
        return false
      }
    }

    return {
      addUser,
      getUserByEmail,
      getUserByUserName,
      getUserByMobile,
      getUserByNameMailMobile,
      getNotifications,
      getPost,
      postProfilePicture,
      followHandler,
      postSave,
      userSavedPosts,
      userSearch,
      userNameUpdate,
      userProfileUpdate,
      removeUserNotification
    }
}

export type userRepositoryMongoDB = typeof userRepositoryMongoDB