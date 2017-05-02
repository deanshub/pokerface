import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList,
} from 'graphql'

import Player from './Player'
import Post from './Post'

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'Represents a player\'s comment to a post',
  fields: ()=>{
    return {
      id: {
        type: GraphQLInt,
        resolve(post){
          return post.id
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
      // photos:{
      //   type: new GraphQLList(GraphQLString),
      //   resolve(post){
      //     return post.photos
      //   },
      // },
      likes: {
        type: new GraphQLList(GraphQLString),
        resolve(post){
          return post.likes
        },
      },
      player: {
        type: Player,
        resolve(comment){
          return comment.getPlayer()
        },
      },
      post: {
        type: Post,
        resolve(comment){
          return comment.getPost()
        },
      },
    }
  },
})

export default Comment
