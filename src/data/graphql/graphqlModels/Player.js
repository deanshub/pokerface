import path from 'path'
import DB from '../../db'
// import {schema as Post} from './Post'
// import {schema as Comment} from './Comment'
import {schema as Upload} from './UploadedFile'
import authUtils from '../../../utils/authUtils'

export const schema =  [`
  type Player {
    username: String
    guest: Boolean
    firstname: String
    lastname: String
    fullname: String
    email: String
    avatar: String
    coverImage: String
    posts: [Post]
    comments: [Comment]
  }

  type Query {
    players(
      phrase: String,
      username: String
    ): [Player]
  }

  type Mutation{
    createPlayer(
      username: String!,
      firstname: String!,
      lastName: String,
      email: String!
    ): Player
    updatePersonalInfo(
      firstname: String,
      lastname: String,
      cover: Upload,
      avatar: Upload
    ): Player
  }
`, Upload]

export const resolvers = {
  Player:{
    username: (player)=>player.username,
    guest: (player)=>!!player.guest,
    firstname: (player)=>player.firstname,
    lastname: (player)=>player.lastname,
    fullname: (player)=>player.fullname,
    email: (player)=> player.email,
    avatar: (player)=>{
      if (!player.avatar && !player.username){
        return '/images/avatar.png'
      }else if (!player.avatar){
        return `/api/avatarGenerator?username=${player.username}`
      }else if (player.avatar.startsWith('http')) {
        return player.avatar
      }
      return `/images/${player.avatar}`
    },
    coverImage: (player)=>{
      if (!player.coverImage && !player.username){
        return '/images/cover.jpg'
      }else if (!player.coverImage){
        return `/api/avatarGenerator?username=${player.username}`
      }else if (!player.coverImage.includes('http')) {
        return `/images/${player.coverImage}`
      }
      return player.coverImage
    },
    posts: (player)=> DB.models.Post.find({player: player._id}),
    comments: (player)=> DB.models.Comment.find({player: player._id}),
  },
  Query: {
    players: (_, {phrase, username})=>{
      if (username){
        return DB.models.Player.find({_id:username})
      }else if (phrase){
        return DB.models.Player.find()
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
    createPlayer: (_, {username, firstname, lastName, email}, context)=>{
      if (authUtils.isSuperAdmin(context.user)){
        return new DB.models.Player({
          _id: username,
          firstname,
          lastName,
          email: email.toLowerCase(),
        }).save()
      }
      return new Error('Only super admins are allowed to this API')
    },
    updatePersonalInfo:(rootValue, {firstname, lastname, cover, avatar}, context)=>{
      return DB.models.Player.findById(context.user._id).then(player=>{
        if (firstname){
          player.set('firstname',firstname)
        }
        if (lastname){
          player.set('lastname',lastname)
        }
        if (cover){
          const filename = path.parse(cover.path).base
          player.set('coverImage', filename)
        }
        if (avatar){
          const filename = path.parse(avatar.path).base
          player.set('avatar', filename)
        }

        return player.save()
      })
    },
  },
}
