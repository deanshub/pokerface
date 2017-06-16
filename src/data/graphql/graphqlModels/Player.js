import {
  GraphQLObjectType, GraphQLString, GraphQLList,
} from 'graphql'
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
      firstName: {
        type: GraphQLString,
        resolve(player){
          return player.firstName
        },
      },
      lastName: {
        type: GraphQLString,
        resolve(player){
          return player.lastName
        },
      },
      fullName: {
        type: GraphQLString,
        resolve(player){
          return player.fullName
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
          return player.getPosts()
        },
      },
      comments:{
        type: new GraphQLList(Comment),
        resolve(player){
          return player.getComments()
        },
      },
    }
  },
})

export default Player
