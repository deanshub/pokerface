import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList,
} from 'graphql'
import DB from '../../db'
import Player from './Player'
import Comment from './Comment'

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Represents a player\'s post',
  fields: ()=>{
    return {
      id: {
        type: GraphQLString,
        resolve(post){
          return post._id
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(post){
          return post.created
        },
      },
      content: {
        type: GraphQLString,
        resolve(post){
          return post.content
        },
      },
      photos:{
        type: new GraphQLList(GraphQLString),
        resolve(post){
          return post.photos
        },
      },
      likes: {
        type: new GraphQLList(Player),
        resolve(post){
          return DB.models.Player.find({
            _id:{
              $in: post.likes,
            },
          })
        },
      },
      player: {
        type: Player,
        resolve(post){
          return DB.models.Player.findById(post.player)
        },
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve(post){
          return DB.models.Comment.find({post:post._id})
            .sort('created')
        },
      },
    }
  },
})

export default Post
