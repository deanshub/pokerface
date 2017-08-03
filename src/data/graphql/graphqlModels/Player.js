import {
  GraphQLObjectType, GraphQLString, GraphQLList,
} from 'graphql'
import DB from '../../db'
import Post from './Post'
import Comment from './Comment'

const Player = new GraphQLObjectType({
  name: 'Player',
  description: 'Represents a player',
  fields: ()=>{
    return {
      username: {
        type: GraphQLString,
        resolve(player){
          return player.username
        },
      },
      firstname: {
        type: GraphQLString,
        resolve(player){
          return player.firstname
        },
      },
      lastname: {
        type: GraphQLString,
        resolve(player){
          return player.lastname
        },
      },
      fullname: {
        type: GraphQLString,
        resolve(player){
          return player.fullname
        },
      },
      email: {
        type: GraphQLString,
        resolve(player){
          return player.email
        },
      },
      avatar: {
        type: GraphQLString,
        resolve(player){
          return player.avatar
        },
      },
      coverImage: {
        type: GraphQLString,
        resolve(player){
          return player.coverImage
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(player){
          return DB.models.Post.find({player: player._id})
        },
      },
      comments:{
        type: new GraphQLList(Comment),
        resolve(player){
          return DB.models.Comment.find({player: player._id})
        },
      },
    }
  },
})

export default Player
