import path from 'path'
import DB from '../../db'
// import {schema as Post} from './Post'
// import {schema as Comment} from './Comment'
import {schema as Upload} from './UploadedFile'
import authUtils from '../../../utils/authUtils'

export const schema =  [`
  type RebrandingDetails {
    primarycolor: String!
    secondarycolor: String!
  }

  interface User {
    username: String
    fullname: String
    email: String
    avatar: String
    coverImage: String
    posts: [Post]
    comments: [Comment]
    rebrandingdetails: RebrandingDetails
  }

  type Organization implements User {
    username: String
    fullname: String
    email: String
    avatar: String
    coverImage: String
    posts: [Post]
    comments: [Comment]
    rebrandingdetails: RebrandingDetails
    players: [Player]
  }

  type Player implements User {
    username: String
    fullname: String
    email: String
    avatar: String
    coverImage: String
    posts: [Post]
    comments: [Comment]
    rebrandingdetails: RebrandingDetails
    firstname: String
    lastname: String
    guest: Boolean
    organiztions: [Organization]
  }

  type Query {
    users(
      phrase: String,
      username: String
    ): [User]
  }

  type Mutation{
    createUser(
      username: String!,
      firstname: String!,
      lastName: String,
      email: String!
    ): User
    updatePersonalInfo(
      firstname: String,
      lastname: String,
      cover: Upload,
      avatar: Upload
    ): User
  }
`, Upload]

export const resolvers = {
  User:{
    __resolveType(user){
      if(user.organization){
        return 'Organization'
      }

      return 'Player'
    },
  },
  Player:{
    organiztions: (player) => player.organiztions,
    firstname: (user)=>user.firstname,
    lastname: (user)=>user.lastname,
    guest: (user)=>!!user.guest,

    username: (user)=>user.username,
    fullname: (user)=>user.fullname,
    email: (user)=> user.email,
    avatar: (user)=>{
      if (!user.avatar && !user.username){
        return '/images/avatar.png'
      }else if (!user.avatar){
        return `/api/avatarGenerator?username=${user.username}`
      }else if (user.avatar.startsWith('http')) {
        return user.avatar
      }
      return `/images/${user.avatar}`
    },
    coverImage: (user)=>{
      if (!user.coverImage && !user.username){
        return '/images/cover.jpg'
      }else if (!user.coverImage){
        return `/api/avatarGenerator?username=${user.username}`
      }else if (!user.coverImage.includes('http')) {
        return `/images/${user.coverImage}`
      }
      return user.coverImage
    },
    posts: (user)=> DB.models.Post.find({user: user._id}),
    comments: (user)=> DB.models.Comment.find({user: user._id}),
  },
  Organization:{
    players: (organiztion) => organiztion.players,
  },
  Query: {
    users: (_, {phrase, username})=>{
      if (username){
        return DB.models.User.find({_id:username}).populate('organiztions')
      }else if (phrase){
        return DB.models.User.find()
          .or([{
            _id: new RegExp(phrase,'i'),
          },{
            firstname: new RegExp(phrase,'i'),
          },{
            lastname: new RegExp(phrase,'i'),
          }])
          .limit(6)
      }
    },
  },
  Mutation: {
    createUser: (_, {username, firstname, lastName, email}, context)=>{
      if (authUtils.isSuperAdmin(context.user)){
        return new DB.models.User({
          _id: username,
          firstname,
          lastName,
          email: email.toLowerCase(),
        }).save()
      }
      return new Error('Only super admins are allowed to this API')
    },
    updatePersonalInfo:(rootValue, {firstname, lastname, cover, avatar}, context)=>{
      return DB.models.User.findById(context.user._id).then(user=>{
        if (firstname){
          user.set('firstname',firstname)
        }
        if (lastname){
          user.set('lastname',lastname)
        }
        if (cover){
          const filename = path.parse(cover.path).base
          user.set('coverImage', filename)
        }
        if (avatar){
          const filename = path.parse(avatar.path).base
          user.set('avatar', filename)
        }

        return user.save()
      })
    },
  },
}
