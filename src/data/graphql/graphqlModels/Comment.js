import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList,
} from 'graphql'
import DB from '../../db'
import Player from './Player'
import Post from './Post'

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'Represents a player\'s comment to a post',
  fields: ()=>{
    return {
      id: {
        type: GraphQLString,
        resolve(comment){
          return comment._id
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(comment){
          return comment.created
        },
      },
      content: {
        type: GraphQLString,
        resolve(comment){
          return comment.content
        },
      },
      photos:{
        type: new GraphQLList(GraphQLString),
        resolve(comment){
          return comment.photos
        },
      },
      likes: {
        type: new GraphQLList(Player),
        resolve(comment){
          return DB.models.Player.find({
            _id:{
              $in: comment.likes,
            },
          })
        },
      },
      player: {
        type: Player,
        resolve(comment){
          return DB.models.Player.findById(comment.player)
        },
      },
      post: {
        type: Post,
        resolve(comment){
          return DB.models.Post.findById(comment.post)
        },
      },
    }
  },
})

export default Comment
