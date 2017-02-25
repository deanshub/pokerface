import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
} from 'graphql'
import Player from './Player'

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Represents a player\'s post',
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
      player: {
        type: Player,
        resolve(post){
          return post.getPlayer()
        },
      },
    }
  },
})

export default Post
